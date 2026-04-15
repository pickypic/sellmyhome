import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Link } from 'react-router';
import { ExternalLink } from 'lucide-react';

const initialNodes: Node[] = [
  // Common Pages
  {
    id: 'home',
    type: 'custom',
    position: { x: 400, y: 0 },
    data: { label: '홈', path: '/', color: 'gray' },
  },
  {
    id: 'signup',
    type: 'custom',
    position: { x: 400, y: 120 },
    data: { label: '회원가입', path: '/signup', color: 'gray' },
  },
  {
    id: 'login',
    type: 'custom',
    position: { x: 400, y: 240 },
    data: { label: '로그인', path: '/login', color: 'gray' },
  },

  // Seller Flow - Left Side
  {
    id: 'seller-dashboard',
    type: 'custom',
    position: { x: 50, y: 360 },
    data: { label: '매도인 대시보드', path: '/seller/dashboard', color: 'blue' },
  },
  {
    id: 'seller-listings',
    type: 'custom',
    position: { x: 50, y: 500 },
    data: { label: '내 매물', path: '/seller/listings', color: 'blue' },
  },
  {
    id: 'add-property',
    type: 'custom',
    position: { x: 300, y: 500 },
    data: { label: '매물 등록', path: '/seller/add-property', color: 'blue' },
  },
  {
    id: 'verification',
    type: 'custom',
    position: { x: 300, y: 640 },
    data: { label: '본인 인증', path: '/seller/verification', color: 'blue' },
  },
  {
    id: 'property-detail-seller',
    type: 'custom',
    position: { x: 50, y: 780 },
    data: { label: '매물 상세 (입찰확인)', path: '/property/1', color: 'blue' },
  },
  {
    id: 'agent-profile-view',
    type: 'custom',
    position: { x: 50, y: 920 },
    data: { label: '중개사 프로필', path: '/agent/1', color: 'blue' },
  },
  {
    id: 'seller-transactions',
    type: 'custom',
    position: { x: 50, y: 1060 },
    data: { label: '거래 내역', path: '/seller/transactions', color: 'blue' },
  },
  {
    id: 'seller-profile',
    type: 'custom',
    position: { x: 300, y: 360 },
    data: { label: '매도인 프로필', path: '/seller/profile', color: 'blue' },
  },

  // Agent Flow - Right Side
  {
    id: 'agent-dashboard',
    type: 'custom',
    position: { x: 700, y: 360 },
    data: { label: '중개인 대시보드', path: '/agent/dashboard', color: 'green' },
  },
  {
    id: 'agent-listings',
    type: 'custom',
    position: { x: 700, y: 500 },
    data: { label: '매물 목록', path: '/agent/listings', color: 'green' },
  },
  {
    id: 'property-detail-agent',
    type: 'custom',
    position: { x: 700, y: 640 },
    data: { label: '매물 상세 (입찰)', path: '/property/1', color: 'green' },
  },
  {
    id: 'bid-form',
    type: 'custom',
    position: { x: 700, y: 780 },
    data: { label: '입찰하기', path: '/property/1/bid', color: 'green' },
  },
  {
    id: 'agent-bids',
    type: 'custom',
    position: { x: 700, y: 920 },
    data: { label: '입찰 내역', path: '/agent/bids', color: 'green' },
  },
  {
    id: 'agent-profile',
    type: 'custom',
    position: { x: 950, y: 360 },
    data: { label: '중개인 프로필', path: '/agent/profile', color: 'green' },
  },
];

const initialEdges: Edge[] = [
  // Common Flow
  { id: 'e-home-signup', source: 'home', target: 'signup', animated: true },
  { id: 'e-signup-login', source: 'signup', target: 'login', animated: true },

  // Seller Flow
  { id: 'e-login-seller', source: 'login', target: 'seller-dashboard', label: '매도인', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e-seller-dash-listings', source: 'seller-dashboard', target: 'seller-listings', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e-seller-dash-add', source: 'seller-dashboard', target: 'add-property', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e-add-verification', source: 'add-property', target: 'verification', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e-verification-listings', source: 'verification', target: 'seller-listings', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e-listings-detail', source: 'seller-listings', target: 'property-detail-seller', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e-detail-agent-profile', source: 'property-detail-seller', target: 'agent-profile-view', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e-detail-transactions', source: 'property-detail-seller', target: 'seller-transactions', label: '선택', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e-seller-dash-profile', source: 'seller-dashboard', target: 'seller-profile', animated: true, style: { stroke: '#3b82f6' } },

  // Agent Flow
  { id: 'e-login-agent', source: 'login', target: 'agent-dashboard', label: '중개인', animated: true, style: { stroke: '#10b981' } },
  { id: 'e-agent-dash-listings', source: 'agent-dashboard', target: 'agent-listings', animated: true, style: { stroke: '#10b981' } },
  { id: 'e-agent-listings-detail', source: 'agent-listings', target: 'property-detail-agent', animated: true, style: { stroke: '#10b981' } },
  { id: 'e-detail-bid', source: 'property-detail-agent', target: 'bid-form', animated: true, style: { stroke: '#10b981' } },
  { id: 'e-bid-bids', source: 'bid-form', target: 'agent-bids', animated: true, style: { stroke: '#10b981' } },
  { id: 'e-agent-dash-profile', source: 'agent-dashboard', target: 'agent-profile', animated: true, style: { stroke: '#10b981' } },
];

function CustomNode({ data }: { data: any }) {
  const colorClasses = {
    gray: 'bg-gray-100 border-gray-300 text-gray-800',
    blue: 'bg-blue-50 border-blue-400 text-blue-800',
    green: 'bg-green-50 border-green-400 text-green-800',
  };

  return (
    <div className={`px-4 py-3 rounded-lg border-2 shadow-md min-w-[160px] ${colorClasses[data.color as keyof typeof colorClasses]}`}>
      {/* Add handles for connections */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
      
      <div className="font-semibold text-sm mb-2">{data.label}</div>
      <Link
        to={data.path}
        className="text-xs flex items-center gap-1 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink className="w-3 h-3" />
        <span>페이지 열기</span>
      </Link>
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

export function FlowView() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Node click handled by internal link
  }, []);

  return (
    <div className="h-screen w-full">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-5 py-4 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">셀마이홈 프로토타입 플로우</h1>
            <p className="text-sm text-gray-600">드래그로 이동 • 스크롤로 줌 • 노드 클릭으로 페이지 이동</p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800"
          >
            홈으로
          </Link>
        </div>
      </div>

      {/* React Flow */}
      <div className="pt-20 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              const color = node.data.color;
              if (color === 'blue') return '#3b82f6';
              if (color === 'green') return '#10b981';
              return '#6b7280';
            }}
            className="border border-gray-300 rounded-lg"
          />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg z-10">
        <div className="text-sm font-semibold text-gray-900 mb-3">범례</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
            <span className="text-sm text-gray-700">공통 페이지</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-50 border-2 border-blue-400 rounded"></div>
            <span className="text-sm text-gray-700">매도인 플로우</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border-2 border-green-400 rounded"></div>
            <span className="text-sm text-gray-700">중개인 플로우</span>
          </div>
        </div>
      </div>
    </div>
  );
}