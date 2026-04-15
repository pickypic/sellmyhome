import { useState } from "react";
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  Tablet,
  MoreVertical,
  MapPin,
  Clock,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router";

// Mock data
const mockDevices = [
  {
    id: 1,
    type: "mobile",
    name: "iPhone 14 Pro",
    os: "iOS 17.3",
    location: "서울, 대한민국",
    ip: "121.162.xxx.xxx",
    lastActive: "방금 전",
    current: true,
    trusted: true,
  },
  {
    id: 2,
    type: "desktop",
    name: "Chrome on Windows",
    os: "Windows 11",
    location: "서울, 대한민국",
    ip: "210.99.xxx.xxx",
    lastActive: "1시간 전",
    current: false,
    trusted: true,
  },
  {
    id: 3,
    type: "desktop",
    name: "Safari on MacBook",
    os: "macOS 14.2",
    location: "서울, 대한민국",
    ip: "175.223.xxx.xxx",
    lastActive: "3일 전",
    current: false,
    trusted: false,
  },
  {
    id: 4,
    type: "tablet",
    name: "iPad Air",
    os: "iPadOS 17.2",
    location: "경기, 대한민국",
    ip: "211.234.xxx.xxx",
    lastActive: "1주일 전",
    current: false,
    trusted: true,
  },
];

export function ConnectedDevices() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState(mockDevices);
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRemoveDevice = (deviceId: number) => {
    if (confirm("이 기기를 제거하시겠습니까?")) {
      setDevices(devices.filter((d) => d.id !== deviceId));
      setSelectedDevice(null);
    }
  };

  const handleTrustDevice = (deviceId: number) => {
    setDevices(
      devices.map((d) =>
        d.id === deviceId ? { ...d, trusted: !d.trusted } : d
      )
    );
    setSelectedDevice(null);
  };

  const handleRemoveAll = () => {
    if (confirm("현재 기기를 제외한 모든 기기를 로그아웃하시겠습니까?")) {
      setDevices(devices.filter((d) => d.current));
      alert("모든 기기에서 로그아웃되었습니다.");
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="w-6 h-6 text-blue-600" />;
      case "tablet":
        return <Tablet className="w-6 h-6 text-purple-600" />;
      case "desktop":
        return <Monitor className="w-6 h-6 text-gray-600" />;
      default:
        return <Monitor className="w-6 h-6 text-gray-600" />;
    }
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
            <h1 className="text-lg font-bold text-gray-900">연결된 기기</h1>
          </div>
        </div>
      </header>

      {/* Info */}
      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600 leading-relaxed">
          최근 30일 이내에 로그인한 기기 목록입니다. 의심스러운 기기가 있다면
          즉시 제거하고 비밀번호를 변경하세요.
        </p>
      </div>

      {/* Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-900 mb-1">
              {devices.length}
            </div>
            <div className="text-xs text-blue-700">연결된 기기</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-900 mb-1">
              {devices.filter((d) => d.trusted).length}
            </div>
            <div className="text-xs text-green-700">신뢰할 수 있는 기기</div>
          </div>
        </div>
      </div>

      {/* Devices List */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">기기 목록</h3>
          {devices.filter((d) => !d.current).length > 0 && (
            <button
              onClick={handleRemoveAll}
              className="text-sm text-red-600 font-medium"
            >
              모두 로그아웃
            </button>
          )}
        </div>

        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getDeviceIcon(device.type)}</div>

                <div className="flex-1 min-w-0">
                  {/* Device Info */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {device.name}
                    </span>
                    {device.current && (
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs font-semibold rounded">
                        현재
                      </span>
                    )}
                    {device.trusted && !device.current && (
                      <Shield className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{device.os}</div>

                  {/* Location & Time */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        {device.location} · {device.ip}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span>마지막 활동: {device.lastActive}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {!device.current && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleTrustDevice(device.id)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium ${
                          device.trusted
                            ? "bg-gray-100 text-gray-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {device.trusted ? "신뢰 해제" : "신뢰할 수 있는 기기"}
                      </button>
                      <button
                        onClick={() => handleRemoveDevice(device.id)}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium"
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-white px-5 py-5">
        <h3 className="font-bold text-gray-900 mb-3">보안 팁</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700 leading-relaxed">
              알 수 없는 기기가 있다면 즉시 로그아웃하고 비밀번호를 변경하세요.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700 leading-relaxed">
              자주 사용하는 기기는 "신뢰할 수 있는 기기"로 설정하면 로그인이
              간편해집니다.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700 leading-relaxed">
              공용 컴퓨터에서는 반드시 로그아웃하고, 비밀번호를 저장하지
              마세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
