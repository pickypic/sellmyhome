import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft, CheckCircle, Shield, Upload, FileText,
  Loader2, AlertCircle, Phone, User as UserIcon, X,
  Building2, Zap, ChevronRight, Info
} from "lucide-react";
import { toast } from "sonner";
import { propertiesApi, authStorage } from "@/api/client";

/* ── 통신사 목록 ─────────────────────────── */
const TELECOM_OPTIONS = [
  { value: 'SKT', label: 'SKT' },
  { value: 'KT', label: 'KT' },
  { value: 'LGU', label: 'LG U+' },
  { value: 'SKT_MVNO', label: 'SKT 알뜰폰' },
  { value: 'KT_MVNO', label: 'KT 알뜰폰' },
  { value: 'LGU_MVNO', label: 'LG 알뜰폰' },
];

/* ── 서류 종류 ───────────────────────────── */
const DOC_TYPES = [
  { value: 'registry', label: '등기부등본', desc: '법원인터넷등기소에서 발급 (가장 정확)', icon: '🏛️' },
  { value: 'deed', label: '건물등기사항전부증명서', desc: '등기소 발급 또는 인터넷 신청', icon: '📄' },
  { value: 'tax_cert', label: '재산세 납세증명서', desc: '국세청 홈택스에서 발급', icon: '💳' },
];

/* ─────────────────────────────────────────────────────────── */

type Mode = 'auto' | 'manual';          // 인증 방식
type AutoResult = 'success' | 'fail' | null;

export function Verification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('property');
  const { user } = authStorage.get();

  /* ── 화면 단계 ──────────────────────── */
  // step 1: 방법 선택 / step 2: 진행 / step 3: 완료
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<Mode>('auto');

  /* ── 자동 인증 상태 ─────────────────── */
  const [autoChecking, setAutoChecking] = useState(false);
  const [autoResult, setAutoResult] = useState<AutoResult>(null);
  const [autoReason, setAutoReason] = useState('');
  const [buildingInfo, setBuildingInfo] = useState<{
    owner_name?: string; build_year?: string; area?: string; building_name?: string;
  } | null>(null);

  /* ── 수동 인증 상태 ─────────────────── */
  const [ownerName, setOwnerName] = useState(user?.name ?? '');
  const [ownerPhone, setOwnerPhone] = useState(user?.phone ?? '');
  const [telecom, setTelecom] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('registry');
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docPreview, setDocPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── 자동 인증 실행 ─────────────────── */
  const runAutoCheck = async () => {
    if (!propertyId) {
      toast.error('매물 정보가 없습니다. 매물 등록 후 다시 시도해주세요.');
      return;
    }
    setAutoChecking(true);
    setAutoResult(null);
    setStep(2);
    try {
      const res = await propertiesApi.checkOwnership(propertyId);
      setBuildingInfo(res.building_info ?? null);
      if (res.verified) {
        setAutoResult('success');
        setStep(3);
        toast.success('소유 인증이 완료되었습니다!');
      } else {
        setAutoResult('fail');
        setAutoReason(res.reason ?? '자동 인증에 실패했습니다.');
      }
    } catch (err: any) {
      setAutoResult('fail');
      setAutoReason(err.message || '자동 인증 중 오류가 발생했습니다.');
    } finally {
      setAutoChecking(false);
    }
  };

  /* ── 수동 파일 선택 ─────────────────── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('PDF 또는 이미지(JPG, PNG)만 가능합니다.'); return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('파일 크기는 10MB 이하여야 합니다.'); return;
    }
    setDocFile(file);
    setUploadedPath('');
    setDocPreview(file.type.startsWith('image/') ? URL.createObjectURL(file) : 'pdf');
  };

  /* ── 수동 인증 제출 ─────────────────── */
  const handleManualSubmit = async () => {
    if (!ownerName.trim()) { toast.error('소유자 성명을 입력해주세요.'); return; }
    if (!ownerPhone.replace(/\D/g, '') || ownerPhone.replace(/\D/g, '').length < 10) {
      toast.error('휴대폰 번호를 올바르게 입력해주세요.'); return;
    }
    if (!telecom) { toast.error('통신사를 선택해주세요.'); return; }
    if (!docFile) { toast.error('소유 인증 서류를 업로드해주세요.'); return; }
    if (!propertyId) { toast.error('매물 정보가 없습니다.'); return; }

    let finalPath = uploadedPath;
    if (!finalPath) {
      setUploading(true);
      try {
        const r = await propertiesApi.uploadVerificationDoc(propertyId, docFile);
        finalPath = r.path;
        setUploadedPath(finalPath);
      } catch (err: any) {
        toast.error(err.message || '파일 업로드에 실패했습니다.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    setSubmitting(true);
    try {
      await propertiesApi.submitVerification(propertyId, {
        owner_name: ownerName,
        owner_phone: ownerPhone.replace(/\D/g, ''),
        doc_paths: finalPath ? [finalPath] : [],
      });
      setStep(3);
      toast.success('인증 신청이 접수되었습니다!');
    } catch (err: any) {
      toast.error(err.message || '제출에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  };

  const progressPct = step === 1 ? 0 : step === 2 ? 50 : 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-base font-semibold text-gray-900 ml-2">본인 소유 인증</h1>
      </div>

      <div className="px-5 py-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1.5 bg-gray-200 rounded-full mb-4">
            <div
              className="h-1.5 bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between">
            {[
              { num: 1, label: '방법 선택' },
              { num: 2, label: '인증 진행' },
              { num: 3, label: '완료' },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  s.num < step  ? 'bg-blue-600 text-white' :
                  s.num === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {s.num < step ? <CheckCircle className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-xs whitespace-nowrap ${s.num === step ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            Step 1 — 인증 방법 선택
        ══════════════════════════════════════════ */}
        {step === 1 && (
          <div className="space-y-4">
            {/* 왜 인증이 필요한가 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex gap-3">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">소유 인증이 필요한 이유</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  사기 매물을 방지하고 안전한 거래를 위해 소유권을 확인합니다.
                </p>
              </div>
            </div>

            {/* 자동 인증 카드 */}
            <button
              onClick={() => { setMode('auto'); runAutoCheck(); }}
              className="w-full bg-blue-600 text-white rounded-2xl p-5 text-left relative overflow-hidden active:bg-blue-700 transition-colors"
            >
              {/* 배경 장식 */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500 rounded-full opacity-40" />
              <div className="absolute -right-2 -bottom-6 w-20 h-20 bg-blue-700 rounded-full opacity-30" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <div className="font-bold text-white">건축물대장 자동 인증</div>
                    <div className="text-blue-200 text-xs">공공데이터포털 연동 · 즉시 확인</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-300 ml-auto" />
                </div>

                <p className="text-sm text-blue-100 leading-relaxed mb-3">
                  국토교통부 건축물대장을 조회하여 <strong className="text-white">소유자명이 일치하면 즉시 인증</strong>이 완료됩니다.
                  별도 서류 제출이 필요 없습니다.
                </p>

                <div className="flex items-center gap-3 text-xs text-blue-200">
                  <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />서류 불필요</span>
                  <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />즉시 완료</span>
                  <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />무료</span>
                </div>
              </div>
            </button>

            {/* 안내 박스 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-2">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 leading-relaxed">
                <strong>자동 인증이 안 되는 경우:</strong> 아파트(집합건물)는 호별 소유자가 등기부에 별도로 등재되어 건축물대장으로 확인이 어려울 수 있습니다. 이 경우 아래 서류 제출 방식을 이용해 주세요.
              </div>
            </div>

            {/* 구분선 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 whitespace-nowrap">또는 직접 서류 제출</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* 수동 인증 버튼 */}
            <button
              onClick={() => { setMode('manual'); setStep(2); }}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5 text-left hover:border-gray-300 active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">등기부등본 제출</div>
                  <div className="text-xs text-gray-500 mt-0.5">서류 업로드 → 어드민 심사 (1-2 영업일)</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════
            Step 2 — 자동 인증 진행 중 / 결과
        ══════════════════════════════════════════ */}
        {step === 2 && mode === 'auto' && (
          <div className="space-y-5">
            {/* 로딩 중 */}
            {autoChecking && (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">건축물대장 조회 중</h3>
                <p className="text-sm text-gray-500">
                  국토교통부 공공데이터를 조회하고 있습니다.<br />
                  잠시만 기다려주세요...
                </p>
              </div>
            )}

            {/* 자동 인증 실패 결과 */}
            {!autoChecking && autoResult === 'fail' && (
              <div className="space-y-4">
                <div className="bg-white border border-orange-200 rounded-2xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">자동 인증 불가</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{autoReason}</p>
                    </div>
                  </div>

                  {/* 건물 정보가 조회된 경우 표시 */}
                  {buildingInfo && (buildingInfo.building_name || buildingInfo.build_year) && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2">조회된 건축물 정보</p>
                      <div className="space-y-1.5 text-sm">
                        {buildingInfo.building_name && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">건물명</span>
                            <span className="font-medium text-gray-900">{buildingInfo.building_name}</span>
                          </div>
                        )}
                        {buildingInfo.build_year && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">준공년도</span>
                            <span className="font-medium text-gray-900">{buildingInfo.build_year}년</span>
                          </div>
                        )}
                        {buildingInfo.area && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">연면적</span>
                            <span className="font-medium text-gray-900">{parseFloat(buildingInfo.area).toLocaleString()} ㎡</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-xs text-blue-800 font-medium mb-1">💡 왜 자동 인증이 안 될 수 있나요?</p>
                    <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                      <li>아파트(집합건물)는 호별 소유자를 건축물대장이 아닌 등기부에서 관리합니다</li>
                      <li>회원 이름과 등기된 이름이 다른 경우 (결혼 후 성씨 변경 등)</li>
                      <li>주소 형식 차이로 조회가 안 된 경우</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setAutoResult(null); setStep(1); }}
                    className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm"
                  >
                    다시 시도
                  </button>
                  <button
                    onClick={() => { setMode('manual'); }}
                    className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-sm"
                  >
                    서류로 인증하기
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            Step 2 — 수동 서류 제출
        ══════════════════════════════════════════ */}
        {step === 2 && mode === 'manual' && (
          <div className="space-y-5">
            {/* 소유자 정보 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-gray-900">소유자 정보</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  소유자 성명 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="등기부등본상 소유자 이름"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  통신사 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TELECOM_OPTIONS.map(opt => (
                    <button key={opt.value} type="button" onClick={() => setTelecom(opt.value)}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        telecom === opt.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  휴대폰 번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel" value={ownerPhone}
                    onChange={e => setOwnerPhone(formatPhone(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="010-0000-0000" maxLength={13}
                  />
                </div>
              </div>
            </div>

            {/* 서류 선택 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3">제출 서류 선택</h3>
              <div className="space-y-2">
                {DOC_TYPES.map(doc => (
                  <button key={doc.value} type="button" onClick={() => setSelectedDocType(doc.value)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-colors ${
                      selectedDocType === doc.value
                        ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}>
                    <span className="text-xl">{doc.icon}</span>
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${selectedDocType === doc.value ? 'text-blue-700' : 'text-gray-900'}`}>
                        {doc.label}
                        {doc.value === 'registry' && (
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">권장</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{doc.desc}</div>
                    </div>
                    {selectedDocType === doc.value && <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 파일 업로드 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3">파일 업로드</h3>
              {!docFile ? (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">파일 선택</p>
                    <p className="text-xs text-gray-500 mt-0.5">PDF, JPG, PNG · 최대 10MB</p>
                  </div>
                </button>
              ) : (
                <div className="space-y-3">
                  {docPreview === 'pdf' ? (
                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                      <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{docFile.name}</p>
                        <p className="text-xs text-gray-500">{(docFile.size / 1024).toFixed(0)} KB · PDF</p>
                      </div>
                      <button type="button" onClick={() => { setDocFile(null); setDocPreview(''); setUploadedPath(''); }}
                        className="p-1.5 hover:bg-red-100 rounded-lg">
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200">
                      <img src={docPreview} alt="미리보기" className="w-full max-h-40 object-contain bg-gray-50" />
                      <button type="button" onClick={() => { setDocFile(null); setDocPreview(''); setUploadedPath(''); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {uploadedPath ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" /> 업로드 완료
                    </div>
                  ) : null}
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-blue-600 underline">
                    다른 파일 선택
                  </button>
                </div>
              )}
              <input ref={fileInputRef} type="file"
                accept="application/pdf,image/jpeg,image/png" className="hidden" onChange={handleFileChange} />
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold">
                이전
              </button>
              <button
                onClick={handleManualSubmit}
                disabled={submitting || uploading || !docFile}
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
                {(submitting || uploading)
                  ? <><Loader2 className="w-4 h-4 animate-spin" />{uploading ? '업로드 중...' : '제출 중...'}</>
                  : '인증 신청 제출'}
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            Step 3 — 완료
        ══════════════════════════════════════════ */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
              {/* 아이콘 */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                mode === 'auto' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                {mode === 'auto'
                  ? <CheckCircle className="w-10 h-10 text-green-600" />
                  : <FileText className="w-10 h-10 text-blue-600" />
                }
              </div>

              {mode === 'auto' ? (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">소유 인증 완료! 🎉</h3>
                  <p className="text-gray-500 mb-5 text-sm">
                    건축물대장 자동 인증이 완료되었습니다.<br />
                    이제 역경매를 시작할 수 있습니다.
                  </p>
                  {buildingInfo && (
                    <div className="bg-green-50 rounded-xl p-4 text-left mb-5">
                      <p className="text-xs font-semibold text-green-700 mb-2">✅ 확인된 정보</p>
                      <div className="space-y-1.5 text-sm">
                        {buildingInfo.building_name && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">건물명</span>
                            <span className="font-medium text-gray-900">{buildingInfo.building_name}</span>
                          </div>
                        )}
                        {buildingInfo.owner_name && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">소유자</span>
                            <span className="font-medium text-gray-900">{buildingInfo.owner_name}</span>
                          </div>
                        )}
                        {buildingInfo.build_year && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">준공년도</span>
                            <span className="font-medium text-gray-900">{buildingInfo.build_year}년</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">신청 완료!</h3>
                  <p className="text-gray-500 mb-5 text-sm">
                    소유 인증 서류가 접수되었습니다.<br />
                    <strong>1~2 영업일</strong> 내 어드민 심사 후 완료됩니다.
                  </p>
                  <div className="bg-blue-50 rounded-xl p-4 text-left mb-5">
                    <p className="text-xs font-semibold text-blue-800 mb-2">📋 다음 단계</p>
                    <div className="space-y-2 text-xs text-blue-700">
                      {['어드민이 제출 서류를 검토합니다', '승인 시 알림으로 안내드립니다', '인증 후 역경매를 시작할 수 있습니다'].map((t, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="w-4 h-4 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => navigate('/seller/listings')}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold">
                내 매물 보기
              </button>
              <button onClick={() => navigate('/seller/dashboard')}
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-semibold">
                홈으로
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
