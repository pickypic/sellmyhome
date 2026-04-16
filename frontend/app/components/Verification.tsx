import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft, CheckCircle, Shield, Upload, FileText,
  Loader2, AlertCircle, Phone, User as UserIcon, X
} from "lucide-react";
import { toast } from "sonner";
import { propertiesApi, authStorage } from "@/api/client";

const TELECOM_OPTIONS = [
  { value: 'SKT', label: 'SKT' },
  { value: 'KT', label: 'KT' },
  { value: 'LGU', label: 'LG U+' },
  { value: 'SKT_MVNO', label: 'SKT 알뜰폰' },
  { value: 'KT_MVNO', label: 'KT 알뜰폰' },
  { value: 'LGU_MVNO', label: 'LG 알뜰폰' },
];

const DOC_TYPES = [
  { value: 'registry', label: '등기부등본', desc: '법원인터넷등기소에서 발급 (가장 확실한 서류)', icon: '🏛️' },
  { value: 'deed', label: '건물등기사항전부증명서', desc: '등기소 발급 또는 인터넷 신청 가능', icon: '📄' },
  { value: 'tax_cert', label: '재산세 납세증명서', desc: '국세청 홈택스에서 발급', icon: '💳' },
];

export function Verification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('property');
  const { user } = authStorage.get();

  const [step, setStep] = useState(1);

  // Step 1 — 본인 정보
  const [ownerName, setOwnerName] = useState(user?.name ?? '');
  const [ownerPhone, setOwnerPhone] = useState(user?.phone ?? '');
  const [telecom, setTelecom] = useState('');

  // Step 2 — 서류 업로드
  const [selectedDocType, setSelectedDocType] = useState('registry');
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docPreview, setDocPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // PDF 또는 이미지만 허용
    if (!['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      toast.error('PDF 또는 이미지 파일(JPG, PNG)만 업로드 가능합니다.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('파일 크기는 10MB 이하여야 합니다.');
      return;
    }
    setDocFile(file);
    setUploadedPath('');
    if (file.type.startsWith('image/')) {
      setDocPreview(URL.createObjectURL(file));
    } else {
      setDocPreview('pdf');
    }
  };

  const handleUploadDoc = async () => {
    if (!docFile) { toast.error('파일을 선택해주세요.'); return; }
    if (!propertyId) { toast.error('매물 정보가 없습니다. 매물 등록 후 다시 시도해주세요.'); return; }

    setUploading(true);
    try {
      const result = await propertiesApi.uploadVerificationDoc(propertyId, docFile);
      setUploadedPath(result.path);
      toast.success('서류가 업로드되었습니다.');
    } catch (err: any) {
      toast.error(err.message || '업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleStep1Next = () => {
    if (!ownerName.trim()) { toast.error('소유자 성명을 입력해주세요.'); return; }
    if (!ownerPhone.trim() || ownerPhone.replace(/\D/g, '').length < 10) {
      toast.error('휴대폰 번호를 올바르게 입력해주세요.'); return;
    }
    if (!telecom) { toast.error('통신사를 선택해주세요.'); return; }
    setStep(2);
  };

  const handleStep2Submit = async () => {
    if (!uploadedPath && !docFile) {
      toast.error('소유 인증 서류를 업로드해주세요.'); return;
    }
    if (!propertyId) {
      toast.error('매물 정보가 없습니다.'); return;
    }

    // 아직 업로드 안 했으면 먼저 업로드
    let finalPath = uploadedPath;
    if (!finalPath && docFile) {
      setUploading(true);
      try {
        const result = await propertiesApi.uploadVerificationDoc(propertyId, docFile);
        finalPath = result.path;
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
      toast.success('소유 인증 신청이 완료되었습니다!');
    } catch (err: any) {
      toast.error(err.message || '제출에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercent = step === 1 ? 0 : step === 2 ? 50 : 100;

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
        {/* Progress */}
        <div className="mb-8">
          {/* Progress Bar */}
          <div className="relative mb-4">
            <div className="h-1.5 bg-gray-200 rounded-full">
              <div
                className="h-1.5 bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          {/* Steps */}
          <div className="flex justify-between">
            {[
              { num: 1, label: '소유자 정보' },
              { num: 2, label: '서류 제출' },
              { num: 3, label: '완료' },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  s.num < step ? 'bg-blue-600 text-white' :
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

        {/* ────── Step 1: 소유자 정보 입력 ────── */}
        {step === 1 && (
          <div className="space-y-5">
            {/* 안내 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">소유 인증이 필요한 이유</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    사기 매물 방지와 안전한 거래를 위해 본인 소유 인증을 진행합니다.
                    입력하신 정보는 인증 목적으로만 사용되며 암호화되어 저장됩니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 소유자 정보 폼 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-gray-900">소유자 정보 입력</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  소유자 성명 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="등기부등본상 소유자 이름"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  통신사 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TELECOM_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTelecom(opt.value)}
                      className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors ${
                        telecom === opt.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  휴대폰 번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={ownerPhone}
                    onChange={e => setOwnerPhone(formatPhone(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="010-0000-0000"
                    maxLength={13}
                  />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                입력하신 이름과 연락처는 어드민의 소유 인증 심사에만 활용됩니다. 제3자에게 제공되지 않습니다.
              </p>
            </div>

            <button
              onClick={handleStep1Next}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold"
            >
              다음 — 서류 제출
            </button>
          </div>
        )}

        {/* ────── Step 2: 소유 서류 업로드 ────── */}
        {step === 2 && (
          <div className="space-y-5">
            {/* 서류 종류 선택 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-4">제출할 서류 선택</h3>
              <div className="space-y-3">
                {DOC_TYPES.map(doc => (
                  <button
                    key={doc.value}
                    type="button"
                    onClick={() => setSelectedDocType(doc.value)}
                    className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-colors ${
                      selectedDocType === doc.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{doc.icon}</span>
                    <div>
                      <div className={`text-sm font-semibold mb-0.5 ${selectedDocType === doc.value ? 'text-blue-700' : 'text-gray-900'}`}>
                        {doc.label}
                        {doc.value === 'registry' && (
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">권장</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{doc.desc}</div>
                    </div>
                    {selectedDocType === doc.value && (
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 파일 업로드 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-4">서류 파일 업로드</h3>

              {!docFile ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">파일을 클릭하여 업로드</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG · 최대 10MB</p>
                  </div>
                </button>
              ) : (
                <div className="space-y-3">
                  {/* 파일 미리보기 */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {docPreview === 'pdf' ? (
                      <div className="flex items-center gap-4 p-4 bg-red-50">
                        <div className="w-12 h-14 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                          <FileText className="w-7 h-7 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{docFile.name}</p>
                          <p className="text-xs text-gray-500">{(docFile.size / 1024).toFixed(0)} KB · PDF</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setDocFile(null); setDocPreview(''); setUploadedPath(''); }}
                          className="p-1.5 rounded-lg hover:bg-red-100"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <img src={docPreview} alt="서류 미리보기" className="w-full max-h-48 object-contain bg-gray-50" />
                        <button
                          type="button"
                          onClick={() => { setDocFile(null); setDocPreview(''); setUploadedPath(''); }}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 업로드 상태 */}
                  {uploadedPath ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      업로드 완료
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleUploadDoc}
                      disabled={uploading}
                      className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-200 disabled:opacity-60"
                    >
                      {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />업로드 중...</> : <><Upload className="w-4 h-4" />서버에 업로드</>}
                    </button>
                  )}

                  {/* 파일 변경 */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-blue-600 underline"
                  >
                    다른 파일 선택
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* 확인 정보 요약 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-gray-500 mb-2">제출 정보 확인</h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">소유자</span>
                  <span className="font-medium text-gray-900">{ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">연락처</span>
                  <span className="font-medium text-gray-900">{ownerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">통신사</span>
                  <span className="font-medium text-gray-900">{TELECOM_OPTIONS.find(t => t.value === telecom)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">서류 종류</span>
                  <span className="font-medium text-gray-900">{DOC_TYPES.find(d => d.value === selectedDocType)?.label}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-lg font-semibold"
              >
                이전
              </button>
              <button
                type="button"
                onClick={handleStep2Submit}
                disabled={submitting || uploading || !docFile}
                className="flex-1 py-4 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />제출 중...</>
                ) : (
                  '인증 신청 제출'
                )}
              </button>
            </div>
          </div>
        )}

        {/* ────── Step 3: 완료 ────── */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">인증 신청 완료!</h3>
              <p className="text-gray-600 mb-6">
                소유 인증 서류가 제출되었습니다.<br />
                <strong>1~2 영업일</strong> 내에 어드민이 검토 후 승인합니다.
              </p>

              <div className="bg-blue-50 rounded-xl p-4 text-left space-y-3 mb-6">
                <h4 className="text-sm font-bold text-blue-900">📋 다음 단계 안내</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    <span>어드민이 제출 서류를 검토합니다.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    <span>승인 완료 시 알림을 받습니다.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    <span>인증 후 역경매를 시작하면 중개사들이 제안을 보냅니다.</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-3 text-left">
                <p className="text-xs text-amber-700">
                  💡 서류 보완이 필요한 경우 등록된 연락처로 안내드립니다. 알림을 꼭 확인해주세요.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/seller/listings')}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-lg font-semibold"
              >
                내 매물 보기
              </button>
              <button
                onClick={() => navigate('/seller/dashboard')}
                className="flex-1 py-4 bg-blue-600 text-white rounded-lg font-semibold"
              >
                홈으로
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
