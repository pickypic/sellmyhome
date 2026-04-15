import { useState } from "react";
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function DataDownload() {
  const navigate = useNavigate();
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);

  const handleBack = () => {
    navigate(-1);
  };

  const dataTypes = [
    {
      id: "profile",
      name: "프로필 정보",
      description: "이름, 연락처, 이메일 등 기본 정보",
    },
    {
      id: "properties",
      name: "매물 정보",
      description: "등록한 매물, 지원 내역, 매칭 기록",
    },
    {
      id: "reviews",
      name: "리뷰 및 평가",
      description: "작성한 리뷰와 받은 평가",
    },
    {
      id: "transactions",
      name: "거래 내역",
      description: "결제 및 포인트 사용 기록",
    },
    {
      id: "messages",
      name: "메시지",
      description: "주고받은 모든 메시지 기록",
    },
    {
      id: "activity",
      name: "활동 기록",
      description: "로그인 기록, 검색 기록 등",
    },
  ];

  const toggleDataType = (id: string) => {
    if (selectedDataTypes.includes(id)) {
      setSelectedDataTypes(selectedDataTypes.filter((t) => t !== id));
    } else {
      setSelectedDataTypes([...selectedDataTypes, id]);
    }
  };

  const selectAll = () => {
    if (selectedDataTypes.length === dataTypes.length) {
      setSelectedDataTypes([]);
    } else {
      setSelectedDataTypes(dataTypes.map((t) => t.id));
    }
  };

  const handleRequestDownload = () => {
    if (selectedDataTypes.length === 0) {
      toast.info("다운로드할 데이터를 선택해주세요.");
      return;
    }
    toast.info("데이터 준비에 최대 3 영업일이 소요됩니다. 이메일로 발송됩니다.");
    setSelectedDataTypes([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={handleBack} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              개인정보 다운로드
            </h1>
          </div>
        </div>
      </header>

      {/* Info */}
      <div className="px-5 py-4 bg-white mb-2">
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-blue-900 font-medium mb-1">
              개인정보 다운로드 안내
            </p>
            <p className="text-xs text-blue-800 leading-relaxed">
              요청하신 데이터는 최대 24시간 이내에 준비되며, 준비가 완료되면
              등록하신 이메일로 다운로드 링크를 보내드립니다. 링크는 7일간
              유효합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Data Types Selection */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">다운로드 데이터 선택</h3>
          <button
            onClick={selectAll}
            className="text-sm text-blue-600 font-medium"
          >
            {selectedDataTypes.length === dataTypes.length
              ? "전체 해제"
              : "전체 선택"}
          </button>
        </div>

        <div className="space-y-2">
          {dataTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => toggleDataType(type.id)}
              className={`w-full flex items-start gap-3 p-4 border rounded-xl transition-colors ${
                selectedDataTypes.includes(type.id)
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  selectedDataTypes.includes(type.id)
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-300"
                }`}
              >
                {selectedDataTypes.includes(type.id) && (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900 mb-0.5">
                  {type.name}
                </div>
                <div className="text-xs text-gray-600">{type.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Request Button */}
      <div className="bg-white px-5 py-5 mb-2">
        <button
          onClick={handleRequestDownload}
          disabled={selectedDataTypes.length === 0}
          className={`w-full py-4 rounded-xl font-bold text-white transition-colors ${
            selectedDataTypes.length === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 active:bg-blue-700"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            다운로드 요청
            {selectedDataTypes.length > 0 &&
              ` (${selectedDataTypes.length}개)`}
          </span>
        </button>
        <p className="text-xs text-gray-600 text-center mt-3">
          선택한 데이터의 준비가 완료되면 이메일로 알려드립니다
        </p>
      </div>

      {/* Download History */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">다운로드 내역</h3>
        <div className="py-12 text-center">
          <Download className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-600">다운로드 내역이 없습니다</p>
        </div>
      </div>

      {/* Legal Notice */}
      <div className="bg-white px-5 py-5">
        <h3 className="font-bold text-gray-900 mb-3">유의사항</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700 leading-relaxed">
              다운로드된 데이터는 개인정보보호법에 따라 안전하게 암호화되어
              제공됩니다.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700 leading-relaxed">
              다운로드 링크는 발송일로부터 7일간 유효하며, 기간 경과 후에는
              재요청이 필요합니다.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700 leading-relaxed">
              대용량 데이터는 준비 시간이 더 오래 걸릴 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
