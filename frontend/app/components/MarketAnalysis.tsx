import { TrendingUp, MapPin, Building2, ArrowLeft, TrendingDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

// Mock data
const mockMarketData = {
  avgPrice: "12.5억원",
  priceChange: "+3.2%",
  avgDays: 42,
  daysChange: "-5일",
  totalListings: 156,
  listingsChange: "+12",
};

const mockRegions = [
  {
    name: "강남구",
    avgPrice: "14.2억원",
    change: "+4.1%",
    trending: "up",
    listings: 45,
  },
  {
    name: "서초구",
    avgPrice: "13.8억원",
    change: "+3.8%",
    trending: "up",
    listings: 38,
  },
  {
    name: "송파구",
    avgPrice: "11.9억원",
    change: "+2.5%",
    trending: "up",
    listings: 42,
  },
  {
    name: "강동구",
    avgPrice: "9.2억원",
    change: "-0.5%",
    trending: "down",
    listings: 31,
  },
];

const mockApartments = [
  {
    name: "역삼래미안",
    avgPrice: "15.2억원",
    change: "+5.2%",
    trending: "up",
    deals: 8,
  },
  {
    name: "서초푸르지오",
    avgPrice: "10.8억원",
    change: "+3.1%",
    trending: "up",
    deals: 5,
  },
  {
    name: "잠실엘스",
    avgPrice: "18.5억원",
    change: "+4.8%",
    trending: "up",
    deals: 6,
  },
];

export function MarketAnalysis() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState("서울 강남구");
  const [selectedPeriod, setSelectedPeriod] = useState<"1month" | "3months" | "6months" | "1year">("3months");

  const handleBack = () => {
    navigate(-1);
  };

  const regions = [
    "서울 강남구",
    "서울 서초구",
    "서울 송파구",
    "서울 강동구",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={handleBack} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">시장 분석</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">
          실시간 시장 동향과 트렌드를 확인하세요
        </p>
      </div>

      {/* Overall Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">전체 시장 개요</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-xs text-blue-600 mb-1">평균 거래가</div>
            <div className="text-xl font-bold text-blue-900 mb-1">
              {mockMarketData.avgPrice}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>{mockMarketData.priceChange}</span>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-xs text-purple-600 mb-1">평균 거래일</div>
            <div className="text-xl font-bold text-purple-900 mb-1">
              {mockMarketData.avgDays}일
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>{mockMarketData.daysChange}</span>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-xs text-green-600 mb-1">전체 매물</div>
            <div className="text-xl font-bold text-green-900 mb-1">
              {mockMarketData.totalListings}건
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>{mockMarketData.listingsChange}</span>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-xs text-orange-600 mb-1">월 거래량</div>
            <div className="text-xl font-bold text-orange-900 mb-1">
              89건
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>+7건</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Analysis */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">지역별 분석</h3>
        <div className="space-y-3">
          {mockRegions.map((region, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-start gap-3 flex-1">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-0.5">
                    {region.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    매물 {region.listings}건
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900 mb-0.5">
                  {region.avgPrice}
                </div>
                <div
                  className={`flex items-center gap-1 text-xs ${
                    region.trending === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {region.trending === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{region.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apartment Complex Analysis */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">단지별 분석</h3>
        <div className="space-y-3">
          {mockApartments.map((apt, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-start gap-3 flex-1">
                <Building2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-0.5">
                    {apt.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    최근 {apt.deals}건 거래
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900 mb-0.5">
                  {apt.avgPrice}
                </div>
                <div
                  className={`flex items-center gap-1 text-xs ${
                    apt.trending === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {apt.trending === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{apt.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Trend Chart */}
      <div className="bg-white px-5 py-5">
        <h3 className="font-bold text-gray-900 mb-4">가격 추이 (최근 6개월)</h3>
        <div className="h-48 bg-gray-50 rounded-lg flex items-end justify-between p-4 gap-2">
          {[
            { month: "10월", value: 70 },
            { month: "11월", value: 75 },
            { month: "12월", value: 72 },
            { month: "1월", value: 80 },
            { month: "2월", value: 85 },
            { month: "3월", value: 90 },
          ].map((data, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-blue-600 rounded-t"
                style={{ height: `${data.value}%` }}
              ></div>
              <span className="text-xs text-gray-600">{data.month}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600">
            최근 6개월간 평균 <span className="font-bold text-green-600">+12.5%</span> 상승
          </p>
        </div>
      </div>
    </div>
  );
}