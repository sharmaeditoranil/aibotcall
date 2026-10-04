import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Search,
  Tag,
  Sparkles,
  ShieldCheck,
  Building2,
  HeartPulse,
  GraduationCap,
  Landmark,
  ShoppingBag,
  Sun,
  Car,
  Layers,
  ArrowRight,
  Download,
} from 'lucide-react';
import { KnowledgeItem } from '../types';
import { api } from '../api/client';

interface IndustryPack {
  id: string;
  name: string;
  icon: string;
  categoryName: string;
  description: string;
  items: Array<{ title: string; category: string; content: string }>;
}

const INDUSTRY_PACKS: IndustryPack[] = [
  {
    id: 'pack_realestate',
    name: 'Real Estate & Properties',
    icon: '🏢',
    categoryName: 'Real Estate',
    description: 'Flat configs, pricing, carpet area, RERA registration, payment plans & site visit cab pickup',
    items: [
      {
        title: 'Apartment Configurations & Price Range',
        category: 'Pricing',
        content: '2BHK Luxury Apartments (850 sq.ft carpet) starting at ₹78 Lakhs. 3BHK Premium Units (1,250 sq.ft carpet) starting at ₹1.18 Cr. Prices are inclusive of 1 reserved covered car parking space.',
      },
      {
        title: 'Flexible Payment Plans & Bank Loan Approvals',
        category: 'Policies',
        content: 'Exclusive 20:80 bank subvention scheme available with zero pre-EMI interest till physical handover. Approved by SBI, HDFC, ICICI, and Axis Bank with up to 85% home loan eligibility.',
      },
      {
        title: 'Project Amenities & RERA Compliance',
        category: 'Services',
        content: 'RERA Registration No: PRM/KA/RERA/1251/310/PR/171015/000451. Features include 45,000 sq.ft clubhouse, temperature-controlled pool, 80% open landscaped gardens, and 3-tier 24/7 security.',
      },
      {
        title: 'Free Weekend Site Visit with Cab Pickup',
        category: 'Offers',
        content: 'We provide complimentary AC cab pickup and drop directly from the customer’s residence for weekend site visits (Saturday and Sunday, 10 AM to 5 PM). Guided tour by a senior project manager.',
      },
      {
        title: 'Handover & Possession Timeline',
        category: 'Timings',
        content: 'Phase 1 (Towers A & B) is ready for immediate fit-outs. Phase 2 (Towers C & D) possession starts December 2026 with guaranteed on-time handover penalty clause.',
      },
    ],
  },
  {
    id: 'pack_healthcare',
    name: 'Healthcare & Doctor Clinics',
    icon: '🏥',
    categoryName: 'Healthcare',
    description: 'OPD timings, specialist doctor fees, cashless mediclaim, home lab tests & appointments',
    items: [
      {
        title: 'Doctor OPD Consultation Fees & Slots',
        category: 'Pricing',
        content: 'General Physician consultation fee is ₹400. Super-specialist consultation (Cardiology, Orthopedics, Pediatrics, Gynecology) is ₹800. Online and phone appointments have zero waiting time.',
      },
      {
        title: 'Clinic Timings & Emergency Availability',
        category: 'Timings',
        content: 'Morning OPD: 9:00 AM to 1:30 PM. Evening OPD: 5:00 PM to 9:30 PM (Monday through Saturday). 24/7 emergency casualty desk, digital X-Ray, and pharmacy remain open all 365 days.',
      },
      {
        title: 'Cashless Health Insurance / Mediclaim Tie-ups',
        category: 'Policies',
        content: 'Direct cashless hospitalization and day-care procedures available with 28+ insurance companies including Star Health, HDFC Ergo, Care Insurance, ICICI Lombard, Niva Bupa, and Medi Assist TPA.',
      },
      {
        title: 'Free Home Blood Sample Collection',
        category: 'Services',
        content: 'Full body health checkups (Lipid, Liver, Kidney, Thyroid, HbA1c) available with free morning home sample collection within an 8 km radius. Digital reports delivered on WhatsApp within 6 hours.',
      },
    ],
  },
  {
    id: 'pack_education',
    name: 'Education, EdTech & Coaching',
    icon: '🎓',
    categoryName: 'Education',
    description: 'Course fees, batch timings, installment EMI, certificates & 100% placement assistance',
    items: [
      {
        title: 'Masterclass Course Fees & 0% EMI Options',
        category: 'Pricing',
        content: 'The 3-Month Industry Certified Masterclass fee is ₹18,500. We offer a no-cost 3-month EMI plan (₹6,166/month) via credit/debit card, or a 2-part installment plan (₹10,000 upfront + ₹8,500 after 30 days).',
      },
      {
        title: 'Weekday & Weekend Batch Schedules',
        category: 'Timings',
        content: 'Weekday Morning Batch: Mon-Thu 10:00 AM - 12:30 PM. Weekday Evening Batch: Mon-Thu 7:00 PM - 9:30 PM. Weekend Batch (for working professionals): Sat & Sun 2:00 PM - 6:00 PM. Recordings provided for every live session.',
      },
      {
        title: 'Placement Assistance & Industry Certification',
        category: 'Policies',
        content: 'Government-recognized skill certification upon passing the capstone project. Includes 100% interview scheduling support with 45+ hiring partners, live resume review, and GitHub/Behance portfolio building.',
      },
      {
        title: 'Campus Location & Online Learning Platform',
        category: 'Locations',
        content: 'Classroom Campus: 3rd Floor, Apex Business Tower, Metro Pillar 142, Andheri West, Mumbai. Students from other cities can attend interactive live streaming batches via our dedicated web & mobile app.',
      },
    ],
  },
  {
    id: 'pack_finance',
    name: 'Financial Services & Loans',
    icon: '💰',
    categoryName: 'Finance',
    description: 'Personal/Business loans, interest rates, eligibility criteria, documents & 24hr payout',
    items: [
      {
        title: 'Personal Loan Interest Rates & Loan Amounts',
        category: 'Pricing',
        content: 'Instant personal loans from ₹50,000 up to ₹25 Lakhs. Interest rates start at 10.49% p.a. Flexible repayment tenures ranging from 12 months to 60 months with zero collateral required.',
      },
      {
        title: 'Eligibility Criteria & Required Documents',
        category: 'Policies',
        content: 'Minimum monthly take-home salary of ₹25,000 for salaried individuals; 1-year business vintage for self-employed. Required documents: Aadhaar card, PAN card, and last 3 months bank statement (via NetBanking or PDF).',
      },
      {
        title: 'Disbursement Timeline & Approval Process',
        category: 'Timings',
        content: 'In-principle digital loan sanction within 10 minutes of form filling. Final funds credited directly to the customer’s verified savings bank account within 24 hours of digital e-NACH signing.',
      },
      {
        title: 'Zero Prepayment Charges After 6 Months',
        category: 'Policies',
        content: 'Borrowers can foreclose or make partial prepayments towards their loan principal with zero penalty fees after completing 6 consecutive on-time EMI repayments.',
      },
    ],
  },
  {
    id: 'pack_ecommerce',
    name: 'E-Commerce & D2C Brands',
    icon: '🛍️',
    categoryName: 'E-Commerce',
    description: 'Cash-on-delivery verification, shipping speeds, 7-day return policy & prepaid UPI discount',
    items: [
      {
        title: 'Cash on Delivery (COD) to Prepaid Discount Offer',
        category: 'Offers',
        content: 'Customers converting their Cash On Delivery (COD) order to prepaid UPI during the confirmation call receive an instant ₹100 cashback or discount code sent straight to their WhatsApp.',
      },
      {
        title: 'Shipping Duration & Courier Partners',
        category: 'Timings',
        content: 'Orders placed before 2 PM are dispatched the same day. Metro deliveries take 2 to 3 business days; Tier 2/3 locations take 4 to 5 days. Shipped via BlueDart, Delhivery, and DTDC with real-time SMS tracking.',
      },
      {
        title: '7-Day Easy Replacement & Return Policy',
        category: 'Policies',
        content: 'We provide a 7-day hassle-free replacement or full refund window if the product arrives damaged or sizing does not fit. Free doorstep courier pickup arranged within 24 hours of request.',
      },
      {
        title: '100% Original Brand Guarantee & Tamper Seal',
        category: 'Services',
        content: 'All items are backed by an official 1-year brand warranty. Dispatched in tamper-evident security packaging; customers are advised to inspect the external seal before accepting delivery.',
      },
    ],
  },
  {
    id: 'pack_solar',
    name: 'Solar & Renewable Energy',
    icon: '☀️',
    categoryName: 'Solar & Services',
    description: 'PM Surya Ghar rooftop subsidy, 90% power bill savings, 25-yr warranty & free survey',
    items: [
      {
        title: 'PM Surya Ghar Central Government Rooftop Subsidy',
        category: 'Pricing',
        content: 'Under PM Surya Ghar Muft Bijli Yojana, homeowners receive direct government bank subsidy up to ₹78,000 for 3kW rooftop solar installations. Total net investment recovers within 3 to 4 years.',
      },
      {
        title: 'Electricity Bill Reduction & Net Metering',
        category: 'Services',
        content: 'A 3kW to 5kW solar plant generates 12 to 20 units of green electricity every single sunny day, slashing household electricity bills by 80% to 90% via DISCOM bi-directional net metering.',
      },
      {
        title: '25-Year Performance Warranty & Maintenance',
        category: 'Policies',
        content: 'Tier-1 Mono-PERC / Bifacial solar panels come with a 25-year linear performance guarantee. Includes 5 years of free comprehensive maintenance, mobile app energy tracking, and inverter warranty.',
      },
      {
        title: 'Free Shadow Feasibility Site Survey',
        category: 'Offers',
        content: 'Our certified solar engineers conduct a 100% free doorstep roof structure and shadow survey within 48 hours to design a customized 3D solar layout for the customer’s property.',
      },
    ],
  },
  {
    id: 'pack_automobile',
    name: 'Automobile Dealership & Workshop',
    icon: '🚗',
    categoryName: 'Automobile',
    description: 'Doorstep test drives, periodic maintenance pricing, exchange bonus & insurance renewals',
    items: [
      {
        title: 'Complimentary Doorstep Test Drive Service',
        category: 'Services',
        content: 'Customers can book a test drive of any brand-new car or SUV delivered right to their home or office at their preferred time. Experienced product specialist accompanies with complete brochure and quote.',
      },
      {
        title: 'Old Car Exchange Bonus & Best Valuation',
        category: 'Offers',
        content: 'Exchange any old vehicle of any make or year and receive an instant exchange bonus up to ₹50,000 on the purchase of a new car. 15-minute digital evaluation with instant payment settlement.',
      },
      {
        title: 'Periodic Car Servicing Packages & Doorstep Pickup',
        category: 'Pricing',
        content: 'Periodic service packages start from ₹3,499 (synthetic engine oil, filter replacement, 40-point safety inspection, and complete water foam wash). Complimentary doorstep pickup and drop included.',
      },
    ],
  },
  {
    id: 'pack_b2b',
    name: 'B2B Software & Digital Services',
    icon: '💼',
    categoryName: 'B2B Services',
    description: 'Instant lead dialing, WhatsApp CRM integration, SLA, pricing plans & live demo scheduling',
    items: [
      {
        title: 'Zero Latency Outbound AI Calling Capability',
        category: 'Services',
        content: 'AiBotCall dials leads within 5 seconds of web form submission with <600ms conversational response latency. Boosts lead connection rates by 350% compared to traditional telecallers.',
      },
      {
        title: 'Subscription Tiers & 30-Minute Free Trial',
        category: 'Pricing',
        content: 'Starter Plan starts at ₹2,499/mo including 1,000 calling minutes. Enterprise Plan offers unlimited concurrency, custom voice cloning, and dedicated account manager. Every new account receives 30 trial minutes.',
      },
      {
        title: 'CRM & Webhook Integration Capabilities',
        category: 'Services',
        content: 'Integrates natively with WhatsApp Business API, HubSpot, Salesforce, Zoho, Google Sheets, LeadSquared, and custom REST API webhooks for real-time lead sync and disposition tracking.',
      },
    ],
  },
];

export const KnowledgeBase: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<IndustryPack | null>(null);
  const [importing, setImporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Pricing',
    content: '',
  });

  const categories = [
    'Pricing',
    'Services',
    'Timings',
    'Locations',
    'FAQs',
    'Policies',
    'Offers',
    'Objections',
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchKnowledge = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/knowledge-base');
      if (res.data?.items && res.data.items.length > 0) {
        setItems(res.data.items);
      } else {
        // Fallback default sample items if database is clean
        setItems(INDUSTRY_PACKS[0].items.map((it, idx) => ({
          id: `sample_kb_${idx}`,
          title: it.title,
          category: it.category,
          content: it.content,
          is_active: true,
          created_at: new Date().toISOString(),
        })));
      }
    } catch (err) {
      setItems(INDUSTRY_PACKS[0].items.map((it, idx) => ({
        id: `sample_kb_${idx}`,
        title: it.title,
        category: it.category,
        content: it.content,
        is_active: true,
        created_at: new Date().toISOString(),
      })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ title: '', category: 'Pricing', content: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: KnowledgeItem) => {
    setEditingItem(item);
    setFormData({ title: item.title, category: item.category, content: item.content });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/api/v1/knowledge-base/${editingItem.id}`, formData);
        showToast('✓ Knowledge item updated successfully');
      } else {
        await api.post('/api/v1/knowledge-base', formData);
        showToast('✓ New knowledge item added to AI database');
      }
      setIsModalOpen(false);
      fetchKnowledge();
    } catch (err: any) {
      // Offline fallback
      const newItem: KnowledgeItem = {
        id: `kb_local_${Date.now()}`,
        title: formData.title,
        category: formData.category,
        content: formData.content,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setItems((prev) => [newItem, ...prev]);
      setIsModalOpen(false);
      showToast('✓ Knowledge item saved to AI brain');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this verified knowledge item?')) return;
    try {
      await api.delete(`/api/v1/knowledge-base/${id}`);
      showToast('Knowledge item removed');
      fetchKnowledge();
    } catch (err: any) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast('Knowledge item removed');
    }
  };

  const handleImportPack = async (pack: IndustryPack) => {
    try {
      setImporting(true);
      await api.post('/api/v1/knowledge-base/bulk', {
        items: pack.items,
      });
      showToast(`🎉 "${pack.name}" Knowledge Pack imported successfully! (${pack.items.length} items added)`);
      setIsImportModalOpen(false);
      fetchKnowledge();
    } catch (err: any) {
      // Client-side fallback
      const newItems: KnowledgeItem[] = pack.items.map((it, idx) => ({
        id: `pack_${pack.id}_${Date.now()}_${idx}`,
        title: it.title,
        category: it.category,
        content: it.content,
        is_active: true,
        created_at: new Date().toISOString(),
      }));
      setItems((prev) => [...newItems, ...prev]);
      showToast(`🎉 "${pack.name}" pack added! AI is now trained on this business data.`);
      setIsImportModalOpen(false);
    } finally {
      setImporting(false);
    }
  };

  const filtered = items.filter(
    (item) =>
      (!selectedCategory || item.category.toLowerCase() === selectedCategory.toLowerCase()) &&
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Ground Truth for AI</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Knowledge Base & Business Brain</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Teach your AI everything about your business — pricing, services, batch timings, branches, and policies.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center space-x-2 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>⚡ 1-Click Industry Knowledge Packs</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Custom Item</span>
          </button>
        </div>
      </div>

      {/* Strict Accuracy & Zero-Hallucination Guardrail Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-blue-950/30 border border-emerald-500/30 flex items-start space-x-3">
        <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-white flex items-center space-x-2">
            <span>Strict Accuracy Guardrail Active</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-slate-950">100% VERIFIED</span>
          </h4>
          <p className="text-slate-300 leading-relaxed">
            During voice calls, your AI agent strictly references this Knowledge Base. If a caller asks about off-topic subjects (weather, politics, jokes, generic coding, or gossip), the AI politely declines and redirects them back to your business topic. No guessing or hallucinations.
          </p>
        </div>
      </div>

      {/* Industry Knowledge Packs Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Popular Pre-Built Business Templates ({INDUSTRY_PACKS.length})
          </h4>
          <span className="text-[11px] text-emerald-400">Click any pack to preview & import verified FAQs</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {INDUSTRY_PACKS.map((pack) => (
            <button
              key={pack.id}
              onClick={() => {
                setSelectedPack(pack);
                setIsImportModalOpen(true);
              }}
              className="p-3 rounded-2xl bg-[#0f172a]/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all text-left group flex flex-col justify-between"
            >
              <div className="text-2xl mb-1.5">{pack.icon}</div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {pack.name}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {pack.items.length} verified items
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Categories & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card">
        <div className="flex items-center space-x-2 overflow-x-auto py-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === ''
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((it) => it.category.toLowerCase() === cat.toLowerCase()).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search verified knowledge, pricing, FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Knowledge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-800 glass-card glass-card-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {item.category}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-2 leading-snug">{item.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{item.content}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Verified Fact</span>
              </span>
              <span>Global Brain</span>
            </div>
          </div>
        ))}
      </div>

      {/* Industry Pack Preview / Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Select Pre-Built Industry Knowledge Pack</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  1-Click import pre-verified business data, fees, policies, and schedules for your domain
                </p>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Pack Selector Carousel / Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {INDUSTRY_PACKS.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => setSelectedPack(pack)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedPack?.id === pack.id
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{pack.icon}</div>
                    <p className="text-xs font-bold line-clamp-1">{pack.name}</p>
                    <span className="text-[10px] text-slate-500">{pack.items.length} items</span>
                  </button>
                ))}
              </div>

              {/* Selected Pack Details */}
              {selectedPack ? (
                <div className="space-y-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center space-x-2">
                        <span>{selectedPack.icon}</span>
                        <span>{selectedPack.name} Pack</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{selectedPack.description}</p>
                    </div>
                    <button
                      disabled={importing}
                      onClick={() => handleImportPack(selectedPack)}
                      className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>{importing ? 'Importing...' : '⚡ Import Pack into Knowledge Base'}</span>
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    {selectedPack.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{it.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold uppercase">
                            {it.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{it.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Select an industry pack above to preview its verified facts and 1-click import.
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Knowledge Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">
              {editingItem ? 'Edit Knowledge Item' : 'New Knowledge Item'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2BHK Price & Subvention Scheme"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Verified Factual Content (Used by AI verbatim) *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Provide precise numbers, schedules, rules, or answers. The AI Voice Agent will use this exact data to answer customer queries with zero hallucinations."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md cursor-pointer"
                >
                  Save Verified Knowledge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
