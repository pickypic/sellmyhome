import { CreditCard, Plus, ArrowLeft, Calendar, Trash2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function PaymentSettings() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
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
            <h1 className="text-lg font-bold text-gray-900">결제 수단</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">
          결제 수단과 결제 내역을 관리하세요
        </p>
      </div>

      {/* Payment Methods */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">결제 수단</h3>
          <button
            onClick={() => toast.info("준비 중입니다")}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg active:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            추가
          </button>
        </div>

        <div className="py-10 text-center">
          <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">결제 수단이 없습니다</p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white px-5 py-5">
        <h3 className="font-bold text-gray-900 mb-4">결제 내역</h3>
        <div className="py-10 text-center">
          <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">결제 내역이 없습니다</p>
        </div>
      </div>
    </div>
  );
}