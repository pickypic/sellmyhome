import { useState, useEffect } from "react";
import { Shield, CheckCircle2, XCircle, Clock, FileText } from "lucide-react";
import { toast } from "sonner";
import { adminApi, AdminVerifications as AdminVerificationsData } from "@/api/client";

type PendingProperty = AdminVerificationsData["pending_properties"][0];
type PendingAgent = AdminVerificationsData["pending_agents"][0];
type VerificationItem =
  | { kind: "property"; data: PendingProperty }
  | { kind: "agent"; data: PendingAgent };

export function AdminVerificationsPage() {
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

  const filtered = items.filter((item) => filter === "all" ? true : item.kind === filter);
  const propertyCount = items.filter((i) => i.kind === "property").length;
  const agentCount = items.filter((i) => i.kind === "agent").length;

  const handleApproveProperty = async (id: string) => {
    if (!confirm("이 매물 소유권을 승인하시겠습니까?")) return;
    try { await adminApi.approveProperty(id); toast.success("승인되었습니다."); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  const handleRejectProperty = async (id: string) => {
    const reason = prompt("반려 사유를 입력해주세요:");
    if (!reason) return;
    try { await adminApi.rejectProperty(id, reason); toast.success("반려되었습니다."); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  const handleApproveAgent = async (userId: string) => {
    if (!confirm("이 중개사 자격을 승인하시겠습니까?")) return;
    try { await adminApi.approveAgent(userId); toast.success("승인되었습니다."); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  const handleRejectAgent = async (userId: string) => {
    const reason = prompt("반려 사유를 입력해주세요:");
    if (!reason) return;
    try { await adminApi.rejectAgent(userId, reason); toast.success("반려되었습니다."); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">인증 심사</h1>
        <span className="text-sm text-gray-500">대기 {items.length}건</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-orange-600">{loading ? "..." : items.length}</div>
          <div className="text-xs text-gray-500 mt-1">전체 대기</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-purple-600">{loading ? "..." : agentCount}</div>
          <div className="text-xs text-gray-500 mt-1">중개사 자격</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-blue-600">{loading ? "..." : propertyCount}</div>
          <div className="text-xs text-gray-500 mt-1">매물 소유권</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {[
          { key: "all", label: "전체" },
          { key: "property", label: "매물 소유권" },
          { key: "agent", label: "중개사 자격" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === tab.key
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading && (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
            불러오는 중...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-gray-100">
            <Shield className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">인증 요청이 없습니다</p>
          </div>
        )}

        {filtered.map((item) => {
          if (item.kind === "property") {
            const p = item.data;
            return (
              <div key={`prop-${p.id}`} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{p.seller?.name ?? "-"}</span>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-purple-50 text-purple-600">매도인</span>
                    </div>
                    <div className="text-sm text-gray-500">{p.seller?.phone ?? "-"}</div>
                  </div>
                  <div className="flex items-center gap-1 text-orange-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs text-gray-400">{p.created_at?.slice(0, 10)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-start gap-2">
                  <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-blue-900">{p.apartment_name}</div>
                    <div className="text-xs text-blue-700">{p.address}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleRejectProperty(p.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50">
                    <XCircle className="w-4 h-4" /> 반려
                  </button>
                  <button onClick={() => handleApproveProperty(p.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">
                    <CheckCircle2 className="w-4 h-4" /> 승인
                  </button>
                </div>
              </div>
            );
          }

          const a = item.data;
          return (
            <div key={`agent-${a.user_id}`} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{a.user?.name ?? "-"}</span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-600">중개사</span>
                  </div>
                  <div className="text-sm text-gray-500">{a.user?.email ?? "-"}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-gray-400">{a.created_at?.slice(0, 10)}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 mb-4 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">자격증 번호</span>
                  <span className="font-semibold text-gray-900">{a.license_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">사무소</span>
                  <span className="font-semibold text-gray-900">{a.office_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">지역</span>
                  <span className="font-semibold text-gray-900">{(a as any).region_gu ?? (a as any).region ?? "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">경력</span>
                  <span className="font-semibold text-gray-900">{a.career_years}년</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleRejectAgent(a.user_id)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50">
                  <XCircle className="w-4 h-4" /> 반려
                </button>
                <button onClick={() => handleApproveAgent(a.user_id)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">
                  <CheckCircle2 className="w-4 h-4" /> 승인
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
