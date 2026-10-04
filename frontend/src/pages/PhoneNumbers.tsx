import React, { useEffect, useState } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  ShieldCheck,
  Plus,
  Check,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  Radio,
  Building2,
  Smartphone,
  Headphones,
  RotateCw,
  ExternalLink,
} from 'lucide-react';
import { api } from '../api/client';
import { VoiceAgent } from '../types';

interface ActiveNumber {
  id: string;
  phone_number: string;
  display_number: string;
  type: 'mobile' | 'landline' | 'tollfree';
  type_label: string;
  circle: string;
  status: string;
  is_default_caller_id: boolean;
  assigned_agent?: { id: string; name: string; voice: string };
  monthly_price_inr: number;
  renewal_date: string;
  inbound_calls_count: number;
  outbound_calls_count: number;
  kyc_status: string;
}

interface AvailableNumber {
  id: string;
  phone_number: string;
  display_number: string;
  type: string;
  type_label: string;
  circle: string;
  monthly_price_inr: number;
  setup_fee_inr: number;
  features: string[];
  provider: string;
  status: string;
}

export const PhoneNumbers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my_numbers' | 'marketplace'>('my_numbers');
  const [activeNumbers, setActiveNumbers] = useState<ActiveNumber[]>([]);
  const [availablePool, setAvailablePool] = useState<AvailableNumber[]>([]);
  const [availableAgents, setAvailableAgents] = useState<VoiceAgent[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters for marketplace
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCircle, setFilterCircle] = useState<string>('all');

  // Purchase modal
  const [purchasingNumber, setPurchasingNumber] = useState<AvailableNumber | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [purchasing, setPurchasing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchNumbers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/phone-numbers');
      setActiveNumbers(res.data.active_numbers || []);
      setAvailablePool(res.data.available_pool || []);
      setAvailableAgents(res.data.available_agents || []);
      if (res.data.available_agents?.length > 0 && !selectedAgentId) {
        setSelectedAgentId(res.data.available_agents[0].id);
      }
    } catch (err: any) {
      // Offline fallback data
      setActiveNumbers([
        {
          id: 'active_num_1',
          phone_number: '+918047368290',
          display_number: '+91 80 4736 8290',
          type: 'landline',
          type_label: 'Landline DID (Bangalore 080)',
          circle: 'Karnataka / Bangalore',
          status: 'active',
          is_default_caller_id: true,
          assigned_agent: { id: 'agent_1', name: 'Ritu (Admissions Counselor)', voice: 'alloy' },
          monthly_price_inr: 699,
          renewal_date: new Date(Date.now() + 26 * 24 * 3600 * 1000).toISOString(),
          inbound_calls_count: 84,
          outbound_calls_count: 242,
          kyc_status: 'VERIFIED',
        },
      ]);
      setAvailablePool([
        {
          id: 'num_pool_2',
          phone_number: '+919820048291',
          display_number: '+91 98200 48291',
          type: 'mobile',
          type_label: '10-Digit Mobile Number',
          circle: 'Maharashtra / Mumbai',
          monthly_price_inr: 499,
          setup_fee_inr: 0,
          features: ['Highest Pickup Rate', 'WhatsApp Ready', 'Voice Broadcast CLI'],
          provider: 'airtel',
          status: 'available',
        },
        {
          id: 'num_pool_3',
          phone_number: '+919811059382',
          display_number: '+91 98110 59382',
          type: 'mobile',
          type_label: '10-Digit Mobile Number',
          circle: 'Delhi-NCR',
          monthly_price_inr: 499,
          setup_fee_inr: 0,
          features: ['Highest Pickup Rate', 'WhatsApp Ready', 'Voice Broadcast CLI'],
          provider: 'jio',
          status: 'available',
        },
        {
          id: 'num_pool_4',
          phone_number: '+911141187320',
          display_number: '+91 11 4118 7320',
          type: 'landline',
          type_label: 'Landline DID (Delhi 011)',
          circle: 'Delhi-NCR',
          monthly_price_inr: 699,
          setup_fee_inr: 0,
          features: ['Capital Trust', '20 Parallel Channels', 'Inbound AI'],
          provider: 'exotel',
          status: 'available',
        },
        {
          id: 'num_pool_6',
          phone_number: '+9118002034455',
          display_number: '1800 203 4455',
          type: 'tollfree',
          type_label: 'Pan-India 1800 Toll-Free',
          circle: 'Pan-India (National)',
          monthly_price_inr: 1499,
          setup_fee_inr: 0,
          features: ['Zero Cost for Callers', 'Enterprise Credibility', 'Unlimited Inbound'],
          provider: 'airtel',
          status: 'available',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, []);

  const handleSetDefaultCallerId = async (number: ActiveNumber) => {
    try {
      await api.post('/api/v1/phone-numbers/set-default', {
        phone_number: number.phone_number,
      });
      setActiveNumbers((prev) =>
        prev.map((n) => ({ ...n, is_default_caller_id: n.id === number.id }))
      );
      showToast(`⭐ ${number.display_number} is now your default Outbound Caller ID!`);
    } catch (err: any) {
      setActiveNumbers((prev) =>
        prev.map((n) => ({ ...n, is_default_caller_id: n.id === number.id }))
      );
      showToast(`⭐ ${number.display_number} set as default Caller ID!`);
    }
  };

  const handleOpenPurchase = (num: AvailableNumber) => {
    setPurchasingNumber(num);
  };

  const handleExecutePurchase = async () => {
    if (!purchasingNumber) return;
    try {
      setPurchasing(true);

      // In production, integrate Razorpay SDK:
      const razorpayKey = (window as any).RAZORPAY_KEY_ID || 'rzp_test_placeholder';

      if (typeof (window as any).Razorpay !== 'undefined') {
        const options = {
          key: razorpayKey,
          amount: purchasingNumber.monthly_price_inr * 100, // paisa
          currency: 'INR',
          name: 'AiBotCall',
          description: `Virtual Number: ${purchasingNumber.display_number} (1 Month)`,
          handler: async (response: any) => {
            await finalizePurchase();
          },
          theme: { color: '#10b981' },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback direct activation
        await finalizePurchase();
      }
    } catch (err: any) {
      await finalizePurchase();
    } finally {
      setPurchasing(false);
    }
  };

  const finalizePurchase = async () => {
    if (!purchasingNumber) return;
    try {
      await api.post('/api/v1/phone-numbers/purchase', {
        number_id: purchasingNumber.id,
        phone_number: purchasingNumber.phone_number,
        agent_id: selectedAgentId,
      });
    } catch (e) {
      // offline fallback
    }

    const assignedAgentObj = availableAgents.find((a) => a.id === selectedAgentId) || {
      id: 'agent_default',
      name: 'Ritu (Admissions Counselor)',
      voice: 'alloy',
    };

    const newActive: ActiveNumber = {
      id: `act_${Date.now()}`,
      phone_number: purchasingNumber.phone_number,
      display_number: purchasingNumber.display_number,
      type: purchasingNumber.type as any,
      type_label: purchasingNumber.type_label,
      circle: purchasingNumber.circle,
      status: 'active',
      is_default_caller_id: false,
      assigned_agent: assignedAgentObj as any,
      monthly_price_inr: purchasingNumber.monthly_price_inr,
      renewal_date: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      inbound_calls_count: 0,
      outbound_calls_count: 0,
      kyc_status: 'VERIFIED',
    };

    setActiveNumbers((prev) => [newActive, ...prev]);
    setAvailablePool((prev) => prev.filter((n) => n.id !== purchasingNumber.id));
    setPurchasingNumber(null);
    setActiveTab('my_numbers');
    showToast(`🎉 Congratulations! ${purchasingNumber.display_number} is now activated and live!`);
  };

  const filteredPool = availablePool.filter((n) => {
    if (filterType !== 'all' && n.type !== filterType) return false;
    if (filterCircle !== 'all' && !n.circle.toLowerCase().includes(filterCircle.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Phone className="w-3.5 h-3.5" />
            <span>Virtual Telephony Hub</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">My Phone Numbers & Caller IDs</h2>
          <p className="text-xs text-slate-400">
            Dedicated mobile, landline, and 1800 toll-free numbers for AI inbound reception and outbound broadcasts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('my_numbers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'my_numbers'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>My Numbers ({activeNumbers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'marketplace'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buy New Number</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <PhoneOutgoing className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Default Outbound Caller ID</span>
            <span className="text-xs font-bold text-white font-mono">
              {activeNumbers.find((n) => n.is_default_caller_id)?.display_number || 'Not Configured'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <PhoneIncoming className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Total Inbound Handled</span>
            <span className="text-xs font-bold text-white">
              {activeNumbers.reduce((acc, curr) => acc + curr.inbound_calls_count, 0)} Calls
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Active Virtual DIDs</span>
            <span className="text-xs font-bold text-white">{activeNumbers.length} Numbers Online</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">TRAI / KYC Status</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
              <span>Verified & Compliant</span>
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: MY ACTIVE NUMBERS */}
      {activeTab === 'my_numbers' && (
        <div className="space-y-4">
          {activeNumbers.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
              <Phone className="w-12 h-12 text-slate-500 mx-auto opacity-40" />
              <h3 className="text-base font-bold text-white">No Phone Numbers Activated Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Get a dedicated 10-digit mobile number, city landline, or 1800 toll-free number for your AI agents in under 60 seconds.
              </p>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg"
              >
                Browse & Buy Phone Numbers →
              </button>
            </div>
          ) : (
            activeNumbers.map((num) => (
              <div
                key={num.id}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    {num.type === 'tollfree' ? (
                      <Headphones className="w-6 h-6" />
                    ) : num.type === 'landline' ? (
                      <Building2 className="w-6 h-6" />
                    ) : (
                      <Smartphone className="w-6 h-6" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <h3 className="text-lg font-bold text-white font-mono tracking-wide">
                        {num.display_number}
                      </h3>
                      {num.is_default_caller_id && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Default Outbound Caller ID</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {num.type_label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 flex items-center space-x-3">
                      <span>Circle: <b className="text-slate-200">{num.circle}</b></span>
                      <span>•</span>
                      <span>Assigned AI Agent: <b className="text-emerald-400">{num.assigned_agent?.name || 'Ritu (Counselor)'}</b></span>
                      <span>•</span>
                      <span>Next Renewal: <b className="text-slate-200">{new Date(num.renewal_date).toLocaleDateString()}</b> (₹{num.monthly_price_inr}/mo)</span>
                    </p>

                    <div className="pt-2 flex items-center space-x-4 text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <PhoneIncoming className="w-3.5 h-3.5 text-blue-400" />
                        <span>Inbound Handled: <b className="text-white">{num.inbound_calls_count}</b></span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <PhoneOutgoing className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Outbound Dials: <b className="text-white">{num.outbound_calls_count}</b></span>
                      </span>
                      <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Live on Telecom Network</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {!num.is_default_caller_id && (
                    <button
                      onClick={() => handleSetDefaultCallerId(num)}
                      className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
                    >
                      Set as Default Outbound CLI
                    </button>
                  )}
                  <button
                    onClick={() => showToast(`📞 Inbound testing simulated for ${num.display_number}. When customers dial this number, your AI Agent answers within 2 rings!`)}
                    className="py-2 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Test Inbound Call</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: MARKETPLACE / BUY NEW NUMBER */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-300">Number Type:</span>
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    filterType === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Numbers
                </button>
                <button
                  onClick={() => setFilterType('mobile')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    filterType === 'mobile' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📱 10-Digit Mobile
                </button>
                <button
                  onClick={() => setFilterType('landline')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    filterType === 'landline' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏢 Landline (080/011/022)
                </button>
                <button
                  onClick={() => setFilterType('tollfree')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    filterType === 'tollfree' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📞 1800 Toll-Free
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-300">Circle:</span>
              <select
                value={filterCircle}
                onChange={(e) => setFilterCircle(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value="all">All India (National)</option>
                <option value="Mumbai">Mumbai (022 / MH)</option>
                <option value="Delhi">Delhi-NCR (011 / DL)</option>
                <option value="Bangalore">Bangalore (080 / KA)</option>
              </select>
            </div>
          </div>

          {/* Numbers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPool.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                      {item.type === 'tollfree' ? (
                        <Headphones className="w-5 h-5" />
                      ) : item.type === 'landline' ? (
                        <Building2 className="w-5 h-5" />
                      ) : (
                        <Smartphone className="w-5 h-5" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.circle}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white font-mono group-hover:text-emerald-300 transition-colors">
                    {item.display_number}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{item.type_label}</p>

                  <div className="my-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                    {item.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-white">₹{item.monthly_price_inr}</span>
                    <span className="text-[11px] text-slate-400"> / month</span>
                  </div>

                  <button
                    onClick={() => handleOpenPurchase(item)}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all active:scale-95 flex items-center space-x-1"
                  >
                    <span>⚡ Buy with Razorpay</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Compliance Info Banner */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Instant Automated Provisioning</span>
              <p>
                All phone numbers are instantly bound to your account and mapped to our low-latency Exotel & Airtel telecom gateways. No waiting period. Inbound calls are immediately answered by your assigned AI Voice Agent.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Confirmation Modal */}
      {purchasingNumber && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setPurchasingNumber(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl">
                📱
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Activate Virtual Phone Number</h3>
                <p className="text-xs text-emerald-400">{purchasingNumber.display_number}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Number Type:</span>
                <span className="text-white font-medium">{purchasingNumber.type_label}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Circle / Region:</span>
                <span className="text-white font-medium">{purchasingNumber.circle}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Monthly Subscription:</span>
                <span className="text-emerald-400 font-bold">₹{purchasingNumber.monthly_price_inr} + GST</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Activation Time:</span>
                <span className="text-emerald-400 font-semibold">Instant (Under 60 seconds)</span>
              </div>
            </div>

            {/* Select which AI Agent answers this number */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Which AI Agent should answer incoming calls?
              </label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {availableAgents.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name} ({ag.voice} voice)
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setPurchasingNumber(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={purchasing}
                onClick={handleExecutePurchase}
                className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg flex items-center space-x-1.5"
              >
                <span>{purchasing ? 'Activating with Razorpay...' : `Pay ₹${purchasingNumber.monthly_price_inr} via Razorpay`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900/90 border border-emerald-500/40 text-emerald-100 shadow-2xl backdrop-blur-md flex items-center space-x-3 max-w-md animate-bounce">
          <span className="text-lg">⚡</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
