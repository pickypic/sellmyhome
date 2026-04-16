import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera, MapPin, Search, X, Building2, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { propertiesApi, authStorage } from "@/api/client";

/* ── 전역 타입 선언 ──────────────────────────────── */
declare global {
  interface Window {
    kakao: any;
    daum?: {
      Postcode: new (opts: { oncomplete: (data: any) => void }) => { open: () => void };
    };
  }
}

interface AptResult {
  id: string;
  name: string;
  address: string;
  jibun_address?: string;
  category?: string;
}

const DIRECTIONS = ['남향', '동향', '서향', '북향', '남동향', '남서향', '북동향', '북서향'];
const KAKAO_KEY = import.meta.env.VITE_KAKAO_APP_KEY as string | undefined;

/* ── SDK 로드 헬퍼 ───────────────────────────────── */
let kakaoMapsLoaded = false;
let kakaoMapsLoading = false;
const kakaoReadyCallbacks: (() => void)[] = [];

function loadKakaoMapsSDK(onReady: () => void) {
  if (kakaoMapsLoaded) { onReady(); return; }
  kakaoReadyCallbacks.push(onReady);
  if (kakaoMapsLoading) return;
  if (!KAKAO_KEY) return; // 키 없으면 포기

  kakaoMapsLoading = true;
  const s = document.createElement('script');
  s.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services&autoload=false`;
  s.id = 'kakao-maps-sdk';
  s.onload = () => {
    window.kakao.maps.load(() => {
      kakaoMapsLoaded = true;
      kakaoMapsLoading = false;
      kakaoReadyCallbacks.forEach(cb => cb());
      kakaoReadyCallbacks.length = 0;
    });
  };
  s.onerror = () => { kakaoMapsLoading = false; };
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────────────── */

export function AddProperty() {
  const navigate = useNavigate();
  const { user } = authStorage.get();

  const [form, setForm] = useState({
    apartment_name: '',
    address: '',
    address_road: '',
    dong: '',
    ho: '',
    area: '',
    floor: '',
    total_floors: '',
    direction: '',
    build_year: '',
    asking_price: '',
    description: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // 아파트 검색 상태
  const [aptQuery, setAptQuery] = useState('');
  const [aptResults, setAptResults] = useState<AptResult[]>([]);
  const [aptLoading, setAptLoading] = useState(false);
  const [aptSelected, setAptSelected] = useState(false);
  const [showAptDropdown, setShowAptDropdown] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  const aptRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [postcodeLoaded, setPostcodeLoaded] = useState(false);

  /* ── Kakao Maps SDK 로드 ──────────────────────── */
  useEffect(() => {
    if (window.kakao?.maps?.services) { setSdkReady(true); return; }
    loadKakaoMapsSDK(() => setSdkReady(true));
  }, []);

  /* ── Daum 우편번호 스크립트 로드 ─────────────── */
  useEffect(() => {
    if (document.getElementById('daum-postcode-script')) { setPostcodeLoaded(true); return; }
    const s = document.createElement('script');
    s.id = 'daum-postcode-script';
    s.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    s.async = true;
    s.onload = () => setPostcodeLoaded(true);
    document.body.appendChild(s);
  }, []);

  /* ── 드롭다운 외부 클릭 닫기 ─────────────────── */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (aptRef.current && !aptRef.current.contains(e.target as Node))
        setShowAptDropdown(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  /* ── Kakao Places 키워드 검색 ────────────────── */
  const searchByKakaoSDK = useCallback((query: string): Promise<AptResult[]> => {
    return new Promise((resolve) => {
      if (!window.kakao?.maps?.services) { resolve([]); return; }
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(
        `${query} 아파트`,
        (data: any[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            resolve(
              data.slice(0, 10).map((d: any) => ({
                id: d.id,
                name: d.place_name,
                address: d.road_address_name || d.address_name,
                jibun_address: d.address_name,
                category: d.category_name,
              })),
            );
          } else {
            resolve([]);
          }
        },
        { size: 10 },
      );
    });
  }, []);

  /* ── 아파트 검색 (디바운스 350ms) ───────────── */
  const handleAptInputChange = useCallback((value: string) => {
    setAptQuery(value);
    setAptSelected(false);
    setForm(prev => ({ ...prev, apartment_name: value }));

    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (value.trim().length < 2) {
      setAptResults([]);
      setShowAptDropdown(false);
      return;
    }

    setAptLoading(true);
    searchTimer.current = setTimeout(async () => {
      try {
        // 1순위: Kakao Maps JS SDK (프론트엔드, VITE_KAKAO_APP_KEY 사용)
        let results: AptResult[] = [];
        if (sdkReady || window.kakao?.maps?.services) {
          results = await searchByKakaoSDK(value.trim());
        }

        // 2순위: 백엔드 프록시 (KAKAO_REST_API_KEY 필요)
        if (results.length === 0) {
          try {
            const backendResults = await propertiesApi.searchApartment(value.trim());
            results = backendResults as AptResult[];
          } catch {
            // 백엔드도 실패하면 조용히 무시
          }
        }

        setAptResults(results);
        setShowAptDropdown(results.length > 0);

        if (results.length === 0 && value.trim().length >= 2) {
          // 결과 없음 — 드롭다운 닫되 에러 없음 (직접 입력 허용)
        }
      } catch {
        setAptResults([]);
      } finally {
        setAptLoading(false);
      }
    }, 350);
  }, [sdkReady, searchByKakaoSDK]);

  /* ── 아파트 단지 선택 ────────────────────────── */
  const handleAptSelect = (apt: AptResult) => {
    setAptQuery(apt.name);
    setAptSelected(true);
    setShowAptDropdown(false);
    setForm(prev => ({
      ...prev,
      apartment_name: apt.name,
      address: apt.address,
      address_road: apt.address,
    }));
    toast.success(`"${apt.name}" 단지가 선택되었습니다.`);
  };

  /* ── Daum 우편번호 팝업 ──────────────────────── */
  const openPostcode = () => {
    if (!postcodeLoaded || !window.daum?.Postcode) {
      toast.error('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        const road = data.roadAddress;
        const jibun = data.jibunAddress;
        setForm(prev => ({ ...prev, address: road || jibun, address_road: road }));
        if (!form.apartment_name && data.buildingName) {
          setAptQuery(data.buildingName);
          setForm(prev => ({ ...prev, apartment_name: data.buildingName }));
        }
        toast.success('주소가 입력되었습니다.');
      },
    }).open();
  };

  /* ── 이미지 처리 ─────────────────────────────── */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - images.length);
    if (!files.length) return;
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => { URL.revokeObjectURL(prev[idx]); return prev.filter((_, i) => i !== idx); });
  };

  const setField = (name: string, value: string) => setForm(prev => ({ ...prev, [name]: value }));

  /* ── 폼 제출 ──────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.apartment_name.trim()) { toast.error('아파트 단지명을 입력해주세요.'); return; }
    if (!form.address.trim()) { toast.error('주소를 입력해주세요.'); return; }
    if (!form.area || isNaN(Number(form.area))) { toast.error('전용면적을 올바르게 입력해주세요.'); return; }
    if (!form.asking_price) { toast.error('희망 매매가를 입력해주세요.'); return; }

    // 가격 파싱 (한국식 억/만 표기)
    let priceNum = 0;
    const raw = form.asking_price.trim();
    if (raw.includes('억')) {
      const parts = raw.split('억');
      const eok = parseInt(parts[0] || '0', 10);
      const man = parseInt((parts[1] || '').replace(/[^0-9]/g, '') || '0', 10);
      priceNum = eok * 100_000_000 + man * 10_000;
    } else if (raw.includes('만')) {
      priceNum = parseInt(raw.replace(/[^0-9]/g, ''), 10) * 10_000;
    } else {
      priceNum = parseInt(raw.replace(/[^0-9]/g, ''), 10);
    }
    if (!priceNum || priceNum <= 0) {
      toast.error('희망 매매가를 올바르게 입력해주세요. (예: 12억, 8억5000만)'); return;
    }

    setSubmitting(true);
    try {
      const property = await propertiesApi.create({
        apartment_name: form.apartment_name,
        address: form.address,
        address_road: form.address_road || form.address,
        dong: form.dong || undefined,
        ho: form.ho || undefined,
        area: parseFloat(form.area),
        floor: parseInt(form.floor) || 1,
        total_floors: parseInt(form.total_floors) || undefined,
        direction: form.direction || undefined,
        build_year: parseInt(form.build_year) || undefined,
        asking_price: priceNum,
        description: form.description || undefined,
      } as any);

      toast.success('매물이 등록되었습니다! 소유 인증을 진행해주세요.');
      navigate(`/seller/verification?property=${property.id}`);
    } catch (err: any) {
      toast.error(err.message || '매물 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── 렌더링 ───────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-base font-semibold text-gray-900 ml-2">새 매물 등록</h1>
      </div>

      <div className="px-5 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* 매물 사진 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              매물 사진 <span className="text-gray-400 font-normal">(최대 5장)</span>
            </label>
            <div className="flex gap-3 flex-wrap">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative w-24 h-24">
                  <img src={src} alt="" className="w-full h-full object-cover rounded-lg border border-gray-200" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {imagePreviews.length < 5 && (
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 bg-gray-50 cursor-pointer hover:bg-gray-100">
                  <Camera className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500">추가</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          {/* ── 아파트 단지명 검색 ──────────────────── */}
          <div ref={aptRef} className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              아파트 단지명 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={aptQuery}
                onChange={e => handleAptInputChange(e.target.value)}
                onFocus={() => aptResults.length > 0 && setShowAptDropdown(true)}
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="예: 역삼래미안, 반포자이"
              />
              {aptLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
              )}
              {!aptLoading && aptSelected && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
            </div>

            {/* 검색 결과 드롭다운 */}
            {showAptDropdown && aptResults.length > 0 && (
              <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto">
                {aptResults.map(apt => (
                  <button
                    key={apt.id}
                    type="button"
                    onClick={() => handleAptSelect(apt)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-blue-50 text-left border-b border-gray-50 last:border-0 active:bg-blue-100"
                  >
                    <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{apt.name}</div>
                      <div className="text-xs text-gray-500 truncate">{apt.address}</div>
                      {apt.category && (
                        <div className="text-xs text-blue-500 mt-0.5 truncate">{apt.category}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <p className="mt-1 text-xs text-gray-400">
              {sdkReady ? '카카오 지도로 검색 중 · ' : ''}단지명을 입력하면 자동완성 목록이 나타납니다.
            </p>
          </div>

          {/* ── 주소 검색 ────────────────────────────── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              주소 <span className="text-red-500">*</span>
            </label>
            <button type="button" onClick={openPostcode}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-left flex items-center gap-2 hover:bg-gray-50 active:bg-gray-100">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className={form.address ? 'text-gray-900 text-sm' : 'text-gray-400 text-sm'}>
                {form.address || '클릭하여 도로명/지번 주소 검색'}
              </span>
            </button>
            {form.address && (
              <div className="mt-2 px-3 py-2 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">📍 {form.address}</p>
              </div>
            )}
          </div>

          {/* ── 동/호수 ──────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">동</label>
              <input type="text" value={form.dong} onChange={e => setField('dong', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="예: 101동" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                호수 <span className="text-xs text-gray-400">(비공개)</span>
              </label>
              <input type="text" value={form.ho} onChange={e => setField('ho', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="예: 1501호" />
            </div>
          </div>

          {/* ── 전용면적 / 희망 매매가 ─────────────── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                전용면적 (㎡) <span className="text-red-500">*</span>
              </label>
              <input type="number" min="1" step="0.01" value={form.area}
                onChange={e => setField('area', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="84.97" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                희망 매매가 <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.asking_price}
                onChange={e => setField('asking_price', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="예: 12억, 8억5000만" />
            </div>
          </div>

          {/* ── 층수 / 전체층수 / 준공년도 ─────────── */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">층수</label>
              <input type="number" min="1" value={form.floor}
                onChange={e => setField('floor', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="15" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">전체층수</label>
              <input type="number" min="1" value={form.total_floors}
                onChange={e => setField('total_floors', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="25" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">준공년도</label>
              <input type="number" min="1960" max={new Date().getFullYear()} value={form.build_year}
                onChange={e => setField('build_year', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="2015" />
            </div>
          </div>

          {/* ── 방향 ─────────────────────────────────── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">방향</label>
            <div className="flex flex-wrap gap-2">
              {DIRECTIONS.map(dir => (
                <button key={dir} type="button"
                  onClick={() => setField('direction', form.direction === dir ? '' : dir)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    form.direction === dir
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
                  }`}>
                  {dir}
                </button>
              ))}
            </div>
          </div>

          {/* ── 매물 특징 ─────────────────────────────── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">매물 특징</label>
            <textarea value={form.description} onChange={e => setField('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              placeholder="예: 남향 고층, 리모델링 완료, 한강 조망, 초등학교 도보 5분 등" />
          </div>

          {/* 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-1">
            <p className="text-sm font-semibold text-blue-800">📋 등록 후 소유 인증 절차</p>
            <p className="text-xs text-blue-700">등록 완료 후 건축물대장 자동 인증 또는 서류 제출로 소유를 확인합니다.</p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-lg font-semibold">
              취소
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-4 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />등록 중...</> : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
