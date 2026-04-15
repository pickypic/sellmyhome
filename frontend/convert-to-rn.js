#!/usr/bin/env node

/**
 * React Web → React Native 자동 변환 스크립트
 * 사용법: node convert-to-rn.js <input-file> <output-file>
 * 예시: node convert-to-rn.js src/app/components/Home.tsx output/Home.tsx
 */

const fs = require('fs');
const path = require('path');

// HTML → React Native 컴포넌트 매핑
const componentMap = {
  div: 'View',
  span: 'Text',
  p: 'Text',
  h1: 'Text',
  h2: 'Text',
  h3: 'Text',
  h4: 'Text',
  h5: 'Text',
  h6: 'Text',
  button: 'Pressable',
  input: 'TextInput',
  img: 'Image',
  a: 'Link',
  section: 'View',
  header: 'View',
  footer: 'View',
  main: 'View',
  nav: 'View',
  article: 'View',
  aside: 'View',
  ul: 'View',
  ol: 'View',
  li: 'View',
};

// 이벤트 핸들러 매핑
const eventMap = {
  onClick: 'onPress',
  onSubmit: 'onPress',
  onChange: 'onChangeText',
  onFocus: 'onFocus',
  onBlur: 'onBlur',
};

// React Native에서 필요한 import 추적
const rnImports = new Set();

function convertComponent(code) {
  let converted = code;

  // 1. HTML 태그를 React Native 컴포넌트로 변환
  Object.entries(componentMap).forEach(([html, rn]) => {
    // 여는 태그
    const openTagRegex = new RegExp(`<${html}([\\s>])`, 'g');
    converted = converted.replace(openTagRegex, (match, suffix) => {
      rnImports.add(rn);
      return `<${rn}${suffix}`;
    });

    // 닫는 태그
    const closeTagRegex = new RegExp(`</${html}>`, 'g');
    converted = converted.replace(closeTagRegex, `</${rn}>`);
  });

  // 2. 이벤트 핸들러 변환
  Object.entries(eventMap).forEach(([web, native]) => {
    const regex = new RegExp(`\\b${web}=`, 'g');
    converted = converted.replace(regex, `${native}=`);
  });

  // 3. react-router → expo-router 변환
  converted = converted.replace(
    /import\s+{\s*useNavigate\s*}\s+from\s+['"]react-router['"]/g,
    "import { router } from 'expo-router'"
  );
  converted = converted.replace(/const\s+navigate\s+=\s+useNavigate\(\)/g, '');
  converted = converted.replace(/navigate\(['"](.+?)['"]\)/g, "router.push('$1')");

  // 4. Link 컴포넌트 변환
  converted = converted.replace(
    /import\s+{\s*Link\s*}\s+from\s+['"]react-router['"]/g,
    "import { Link } from 'expo-router'"
  );
  converted = converted.replace(/to=/g, 'href=');

  // 5. localStorage → SecureStore 변환
  if (converted.includes('localStorage')) {
    rnImports.add('SecureStore');
    converted = converted.replace(
      /localStorage\.setItem\(['"](.+?)['"],\s*(.+?)\)/g,
      "await SecureStore.setItemAsync('$1', $2)"
    );
    converted = converted.replace(
      /localStorage\.getItem\(['"](.+?)['"]\)/g,
      "await SecureStore.getItemAsync('$1')"
    );
    converted = converted.replace(
      /localStorage\.removeItem\(['"](.+?)['"]\)/g,
      "await SecureStore.deleteItemAsync('$1')"
    );
  }

  // 6. CSS gradient → LinearGradient 변환
  if (converted.includes('bg-gradient')) {
    rnImports.add('LinearGradient');
    // className에서 gradient 찾기 (수동 변환 필요 메시지 추가)
    converted = `/* TODO: bg-gradient-* 클래스를 LinearGradient 컴포넌트로 수동 변환 필요 */\n` + converted;
  }

  // 7. Image src 변환
  converted = converted.replace(
    /<Image\s+src=\{([^}]+)\}/g,
    '<Image source={$1}'
  );

  // 8. TextInput에 필요한 속성 추가 주석
  if (converted.includes('TextInput')) {
    converted = `/* TODO: TextInput에 필요한 props 추가 (placeholder, value, onChangeText 등) */\n` + converted;
  }

  // 9. SafeAreaView 감싸기 (최상위 View를 SafeAreaView로)
  if (converted.includes('return (') && converted.includes('<View')) {
    rnImports.add('SafeAreaView');
    // 첫 번째 최상위 View를 찾아서 SafeAreaView로 변환 (간단한 경우만)
    // 복잡한 경우 수동 변환 필요
  }

  return converted;
}

function generateImports() {
  const imports = [];

  // React Native 기본 컴포넌트
  const rnComponents = Array.from(rnImports).filter(
    c => !['LinearGradient', 'SecureStore', 'SafeAreaView'].includes(c)
  );
  if (rnComponents.length > 0) {
    imports.push(`import { ${rnComponents.join(', ')} } from 'react-native';`);
  }

  // SafeAreaView
  if (rnImports.has('SafeAreaView')) {
    imports.push(`import { SafeAreaView } from 'react-native-safe-area-context';`);
  }

  // LinearGradient
  if (rnImports.has('LinearGradient')) {
    imports.push(`import { LinearGradient } from 'expo-linear-gradient';`);
  }

  // SecureStore
  if (rnImports.has('SecureStore')) {
    imports.push(`import * as SecureStore from 'expo-secure-store';`);
  }

  return imports.join('\n');
}

function addWarnings() {
  const warnings = [
    '/**',
    ' * 🚨 자동 변환된 파일입니다. 다음 사항을 수동으로 확인하세요:',
    ' * ',
    ' * 1. LinearGradient: bg-gradient-* 클래스를 LinearGradient 컴포넌트로 변환',
    ' * 2. TextInput: placeholder, value, onChangeText 등 필수 props 추가',
    ' * 3. Image: source prop에 require() 또는 { uri: ... } 형식 사용',
    ' * 4. ScrollView: 스크롤이 필요한 긴 컨텐츠는 ScrollView로 감싸기',
    ' * 5. FlatList: 리스트 렌더링은 map 대신 FlatList 사용 권장',
    ' * 6. StyleSheet: 복잡한 스타일은 StyleSheet.create() 사용 고려',
    ' * 7. Async/Await: SecureStore 사용 시 함수를 async로 변경',
    ' * 8. Dimensions: 화면 크기가 필요한 경우 Dimensions.get("window") 사용',
    ' * 9. Platform: OS별 분기가 필요한 경우 Platform.OS 사용',
    ' * 10. NativeWind: className이 작동하지 않으면 babel.config.js 확인',
    ' */',
  ];
  return warnings.join('\n');
}

function processFile(inputPath, outputPath) {
  console.log(`📖 읽는 중: ${inputPath}`);

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ 파일을 찾을 수 없습니다: ${inputPath}`);
    process.exit(1);
  }

  let code = fs.readFileSync(inputPath, 'utf-8');

  console.log('🔄 변환 중...');

  // 기존 import 추출 (React 등 기본 import는 유지)
  const importRegex = /^import\s+.+from\s+['"].+['"];?\s*$/gm;
  const existingImports = code.match(importRegex) || [];

  // import 제거 후 변환
  const codeWithoutImports = code.replace(importRegex, '');

  // 컴포넌트 변환
  const converted = convertComponent(codeWithoutImports);

  // 새로운 import 생성
  const newImports = generateImports();

  // React import 유지 (useState, useEffect 등 있을 경우)
  const reactImport = existingImports.find(i => i.includes('from \'react\'') || i.includes('from "react"'));

  // 최종 코드 조합
  const finalCode = [
    addWarnings(),
    reactImport || "import React from 'react';",
    newImports,
    ...existingImports.filter(i =>
      !i.includes('from \'react\'') &&
      !i.includes('from "react"') &&
      !i.includes('react-router')
    ),
    '',
    converted,
  ].join('\n');

  // 출력 디렉토리 생성
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 파일 저장
  fs.writeFileSync(outputPath, finalCode, 'utf-8');

  console.log(`✅ 변환 완료: ${outputPath}`);
  console.log('');
  console.log('📝 변환된 컴포넌트:');
  Array.from(rnImports).forEach(component => {
    console.log(`  - ${component}`);
  });
  console.log('');
  console.log('⚠️  수동 확인이 필요한 항목은 파일 상단 주석을 확인하세요.');
}

// CLI 실행
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('사용법: node convert-to-rn.js <input-file> <output-file>');
    console.log('');
    console.log('예시:');
    console.log('  node convert-to-rn.js src/app/components/Home.tsx rn-output/Home.tsx');
    console.log('');
    console.log('전체 변환:');
    console.log('  node convert-all.js  (별도 스크립트 참조)');
    process.exit(1);
  }

  const [inputPath, outputPath] = args;
  processFile(inputPath, outputPath);
}

module.exports = { convertComponent, processFile };
