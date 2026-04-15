import { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi, AdminVerifications as AdminVerificationsData } from "@/api/client";

type PendingProperty = AdminVerificationsData["pending_properties"][0];
type PendingAgent = AdminVerificationsData["pending_agents"][0];

type VerificationItem =
  | { kind: "property"; data: PendingProperty }
  | { kind: "agent"; data: PendingAgent };

export function AdminVerifications() {
  const [filter, setFilter] = useState<"all" | "property" | "agent">("all");
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.getVerifications()
      .then((data) => {
        const merged: VerificationItem[] = [
          ...data.pending_properties.map((d) => ({ kind: "property" as const, data: d })),
          ...data.pending_agents.map((d) => ({ kind: "agent" as const, data: d })),
        ];
        setItems(merged);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = items.filter((item) =>
    filter === "all" ? true : item.kind === filter
  );

  const propertyCount = items.filter((i) => i.kind === "property").length;
  const agentCount = items.filter((i) => i.kind === "agent").length;

  const handleApproveProperty = async (id: string) => {
    if (!confirm("이 매물 소유권을 승인하시겠습니까?")) return;
    try {
      await adminApi.approveProperty(id);
      toast.success("승인되었습니다.");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleRejectProperty = async (id: string) => {
    const reason = prompt("반려 사유를 입력해주세요:");
    if (!reason) return;
    try {
      await adminApi.rejectProperty(id, reason);
      toast.success("반려되었습니다.");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleApproveAgent = async (userId: string) => {
    if (!confirm("이 중개사 자격을 승인하시겠습니까?")) return;
    try {
      await adminApi.approveAgent(userId);
      toast.success("승인되었습니다.");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleRejectAgent = async (userId: string) => {
    const reason = prompt("반려 사유를 입력해주세요:");
    if (!reason) return;
    try {
      await adminApi.rejectAgent(userId, reason);
      toast.success("반려되었습니다.");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 py-6 mb-2">
        <h1 className="text-xl font-bold text-gray-900 mb-1">인증 승인</h1>
        <p className="text-sm text-gray-600">
          사용자 인증 요청을 검토하고 승인하세요
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: "all", label: "전체" },
            { key: "property", label: "매물 소유권" },
            { key: "agent", label: "중개사 자격" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                filter === tab.key
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 active:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {loading ? "..." : items.length}
            </div>
            <div className="text-xs text-orange-900">전체 대기</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {loading ? "..." : agentCount}
            </div>
            <div className="text-xs text-purple-900">중개사</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {loading ? "..." : propertyCount}
            </div>
            <div className="text-xs text-blue-900">매물 소유권</div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white px-5 py-5">
        {loading && <div className="py-10 text-center text-gray-400 text-sm">불러오는 중...</div>}

        <div className="space-y-3">
          {filtered.map((item) => {
            if (item.kind === "property") {
              const p = item.data;
              return (
                <div key={`prop-${p.id}`} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{p.seller?.name ?? "-"}</span>
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-purple-50 text-purple-600">
                          매도인
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">{p.seller?.phone ?? "-"}</div>
                      <div className="text-xs text-gray-500">{p.created_at?.slice(0, 10)}</div>
                    </div>
                    <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="text-xs text-gray-600 mb-0.5">인증 유형</div>
                    <div className="text-sm font-medium text-gray-900">매물 소유권</div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-blue-900 mb-0.5">{p.apartment_name}</div>
                        <div className="text-xs text-blue-700">{p.address}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRejectProperty(p.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-red-300 text-red-600 rounded-lg font-semibold active:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                      반려
                    </button>
                    <button
                      onClick={() => handleApproveProperty(p.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg font-semibold active:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      승인
                    </button>
                  </div>
                </div>
              );
            }

            // agent
            const a = item.data;
            return (
              <div key={`agent-${a.user_id}`} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{a.user?.name ?? "-"}</span>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-600">
                        중개인
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{a.user?.email ?? "-"}</div>
                    <div className="text-xs text-gray-500">{a.created_at?.slice(0, 10)}</div>
                  </div>
                  <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="text-xs text-gray-600 mb-0.5">인증 유형</div>
                  <div className="text-sm font-medium text-gray-900">공인중개사 자격증</div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 mb-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">자격증 번호</span>
                    <span className="font-semibold text-gray-900">{a.license_number}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">사무소</span>
                    <span className="font-semibold text-gray-900">{a.office_name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">지역</span>
                    <span className="font-semibold text-gray-900">{a.region}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">경력</span>
                    <span className="font-semibold text-gray-900">{a.career_years}년</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRejectAgent(a.user_id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-red-300 text-red-600 rounded-lg font-semibold active:bg-red-50"
                  >
                    <XCircle className="w-4 h-4" />
                    반려
                  </button>
                  <button
                    onClick={() => handleApproveAgent(a.user_id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg font-semibold active:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    승인
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">인증 요청이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
