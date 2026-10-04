import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Overview } from './pages/Overview';
import { Agents } from './pages/Agents';
import { Campaigns } from './pages/Campaigns';
import { Leads } from './pages/Leads';
import { Calls } from './pages/Calls';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Webhooks } from './pages/Webhooks';
import { Suppression } from './pages/Suppression';
import { ApiKeys } from './pages/ApiKeys';
import { Tester } from './pages/Tester';
import { Settings } from './pages/Settings';
import { Billing } from './pages/Billing';
import { Team } from './pages/Team';
import { Integrations } from './pages/Integrations';
import { SuperAdmin } from './pages/SuperAdmin';
import { PhoneNumbers } from './pages/PhoneNumbers';
import { Referrals } from './pages/Referrals';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PricingPage } from './pages/PricingPage';
import { LandingPage } from './pages/LandingPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { DocsPage } from './pages/DocsPage';
import { SeoLandingPage } from './pages/SeoLandingPage';
import { SEO_PAGES_DATA } from './data/seoPagesData';
import { Profile } from './pages/Profile';
import { CallDetailModal } from './components/CallDetailModal';
import { QuickCallModal } from './components/QuickCallModal';
import { User, Call, WebhookDelivery } from './types';
import { api } from './api/client';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('aibotcall_token'));
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [profileSection, setProfileSection] = useState<'details' | 'billing' | 'referrals'>('details');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getInitialNavigation = (): { view: 'landing' | 'pricing' | 'login' | 'register' | 'terms' | 'privacy' | 'refund' | 'contact' | 'about' | 'blog' | 'docs' | 'seo'; slug?: string } => {
    const rawPath = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
    if (rawPath in SEO_PAGES_DATA) {
      return { view: 'seo', slug: rawPath };
    }
    if (rawPath.includes('docs') || rawPath.includes('documentation') || rawPath.includes('guide')) return { view: 'docs' };
    if (rawPath.includes('blog')) return { view: 'blog' };
    if (rawPath.includes('about')) return { view: 'about' };
    if (rawPath.includes('terms')) return { view: 'terms' };
    if (rawPath.includes('privacy')) return { view: 'privacy' };
    if (rawPath.includes('refund') || rawPath.includes('cancellation')) return { view: 'refund' };
    if (rawPath.includes('contact')) return { view: 'contact' };
    if (rawPath.includes('pricing')) return { view: 'pricing' };
    if (rawPath.includes('login')) return { view: 'login' };
    if (rawPath.includes('register')) return { view: 'register' };
    return { view: 'landing' };
  };

  const initialNav = getInitialNavigation();
  const [authView, setAuthView] = useState<'landing' | 'pricing' | 'login' | 'register' | 'terms' | 'privacy' | 'refund' | 'contact' | 'about' | 'blog' | 'docs' | 'seo'>(initialNav.view);
  const [currentSeoSlug, setCurrentSeoSlug] = useState<string>(initialNav.slug || 'ai-voice-calling-software');
  const [selectedPlan, setSelectedPlan] = useState<string>('FREE_TRIAL');

  // Modals
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [callWebhookDeliveries, setCallWebhookDeliveries] = useState<WebhookDelivery[]>([]);
  const [isQuickCallOpen, setIsQuickCallOpen] = useState(false);

  // Load user on startup
  useEffect(() => {
    if (token) {
      const savedUserStr = localStorage.getItem('aibotcall_user');
      if (savedUserStr) {
        try {
          setUser(JSON.parse(savedUserStr));
        } catch {}
      }

      api
        .get('/api/v1/auth/me')
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem('aibotcall_user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          if (!savedUserStr) {
            localStorage.removeItem('aibotcall_token');
            setToken(null);
            setUser(null);
          }
        });
    }
  }, [token]);

  const handleLoginSuccess = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('aibotcall_token');
    setToken(null);
    setUser(null);
    setAuthView('landing');
  };

  const handleSelectCall = async (call: Call) => {
    try {
      const res = await api.get(`/api/v1/calls/${call.id}`);
      setSelectedCall(res.data.call);
      setCallWebhookDeliveries(res.data.webhook_deliveries || []);
    } catch {
      setSelectedCall(call);
      setCallWebhookDeliveries([]);
    }
  };

  const refreshCurrentView = async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const nav = getInitialNavigation();
      if (nav.view === 'seo' && nav.slug) {
        setCurrentSeoSlug(nav.slug);
      }
      setAuthView(nav.view);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // If user is not authenticated
  if (!token || !user) {
    const sharedPublicNav = {
      onBackToHome: () => {
        window.history.pushState({}, '', '/');
        setAuthView('landing');
      },
      onGoToAbout: () => {
        window.history.pushState({}, '', '/about/');
        setAuthView('about');
      },
      onGoToBlog: () => {
        window.history.pushState({}, '', '/blog/');
        setAuthView('blog');
      },
      onGoToDocs: () => {
        window.history.pushState({}, '', '/docs/');
        setAuthView('docs');
      },
      onNavigateDocs: () => {
        window.history.pushState({}, '', '/docs/');
        setAuthView('docs');
      },
      onGoToPricing: () => {
        window.history.pushState({}, '', '/pricing/');
        setAuthView('pricing');
      },
      onGoToContact: () => {
        window.history.pushState({}, '', '/contact/');
        setAuthView('contact');
      },
      onGoToLogin: () => {
        window.history.pushState({}, '', '/login/');
        setAuthView('login');
      },
      onGoToRegister: () => {
        setSelectedPlan('FREE_TRIAL');
        window.history.pushState({}, '', '/register/');
        setAuthView('register');
      },
      onNavigatePolicy: (policy: 'terms' | 'privacy' | 'refund' | 'security' | 'data-privacy' | 'call-consent-policy') => {
        if (policy === 'security' || policy === 'data-privacy' || policy === 'call-consent-policy') {
          setCurrentSeoSlug(policy);
          window.history.pushState({}, '', `/${policy}/`);
          setAuthView('seo');
        } else {
          window.history.pushState({}, '', `/${policy}/`);
          setAuthView(policy);
        }
      },
      onNavigateSeoPage: (slug: string) => {
        setCurrentSeoSlug(slug);
        window.history.pushState({}, '', `/${slug}/`);
        setAuthView('seo');
      },
    };

    if (authView === 'seo') {
      return <SeoLandingPage slug={currentSeoSlug} {...sharedPublicNav} />;
    }

    if (authView === 'landing') {
      return (
        <LandingPage
          onOpenAuth={(mode, plan) => {
            if (plan) setSelectedPlan(plan);
            setAuthView(mode);
          }}
          onOpenPricing={() => {
            window.history.pushState({}, '', '/pricing/');
            setAuthView('pricing');
          }}
          onOpenPolicy={(policy) => sharedPublicNav.onNavigatePolicy(policy as any)}
          onOpenAbout={() => {
            window.history.pushState({}, '', '/about/');
            setAuthView('about');
          }}
          onOpenContact={() => {
            window.history.pushState({}, '', '/contact/');
            setAuthView('contact');
          }}
          onOpenBlog={() => {
            window.history.pushState({}, '', '/blog/');
            setAuthView('blog');
          }}
          onOpenDocs={() => {
            window.history.pushState({}, '', '/docs/');
            setAuthView('docs');
          }}
          onNavigateSeoPage={sharedPublicNav.onNavigateSeoPage}
        />
      );
    }

    if (authView === 'docs') {
      return <DocsPage {...sharedPublicNav} onNavigateDocs={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />;
    }

    if (authView === 'about') {
      return <AboutPage {...sharedPublicNav} />;
    }

    if (authView === 'blog') {
      return <BlogPage {...sharedPublicNav} />;
    }

    if (authView === 'terms') {
      return <TermsPage {...sharedPublicNav} />;
    }

    if (authView === 'privacy') {
      return <PrivacyPolicyPage {...sharedPublicNav} />;
    }

    if (authView === 'refund') {
      return <RefundPolicyPage {...sharedPublicNav} />;
    }

    if (authView === 'contact') {
      return <ContactUsPage {...sharedPublicNav} />;
    }

    if (authView === 'pricing') {
      return (
        <PricingPage
          {...sharedPublicNav}
          onSelectPlan={(plan) => {
            setSelectedPlan(plan);
            setAuthView('register');
          }}
        />
      );
    }

    if (authView === 'register') {
      return (
        <Register
          selectedPlan={selectedPlan}
          onLoginSuccess={handleLoginSuccess}
          onGoToLogin={() => setAuthView('login')}
          onBackToLanding={() => setAuthView('landing')}
        />
      );
    }

    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onGoToRegister={() => setAuthView('register')}
        onBackToLanding={() => setAuthView('landing')}
      />
    );
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview':
        return { title: 'Operational Analytics & Overview', subtitle: 'Live metrics, active call funnel and daily statistics' };
      case 'profile':
        return { title: 'My Profile & Account Settings', subtitle: 'Personal details, password security, voice wallet billing & referral commissions' };
      case 'agents':
        return { title: 'AI Voice Agents', subtitle: 'Interactive conversational agents, voice configuration & prompts' };
      case 'numbers':
        return { title: 'My Phone Numbers & Virtual DIDs', subtitle: 'Dedicated mobile, landline, and 1800 toll-free numbers for AI calling' };
      case 'campaigns':
        return { title: 'Broadcast Campaigns', subtitle: 'Batch outbound dialing with CSV contact imports & controls' };
      case 'leads':
        return { title: 'Contacts & Website Leads', subtitle: 'Incoming webhook leads with verified consent' };
      case 'calls':
        return { title: 'Telephony Calls Log', subtitle: 'Full call recordings, transcriptions & CRM statuses' };
      case 'referrals':
        return { title: 'Refer & Earn Partner Program', subtitle: 'Earn 20% lifetime commission on every recharge and withdraw via UPI / Bank' };
      case 'knowledge':
        return { title: 'Knowledge Base', subtitle: 'Verified business FAQs, course fees & branch information' };
      case 'webhooks':
        return { title: 'CRM Outgoing Deliveries', subtitle: 'Audit log of webhook events dispatched to Deal CRM / WhatsApp CRM' };
      case 'suppression':
        return { title: 'Suppression (Do Not Call)', subtitle: 'Compliance blacklist protecting opted-out contacts' };
      case 'apikeys':
        return { title: 'API Keys', subtitle: 'Scoped credentials for external lead ingestion' };
      case 'billing':
        return { title: 'SaaS Billing & Voice Credits', subtitle: 'Calling minute packages, subscriptions, and usage meters' };
      case 'team':
        return { title: 'Team & Workspace Members', subtitle: 'Manage organization permissions and team roles' };
      case 'tester':
        return { title: 'Webhook Delivery Tester', subtitle: 'Test payload formatting, latency & HMAC SHA-256 signatures' };
      case 'settings':
        return { title: 'System & Telephony Settings', subtitle: 'Carrier parameters, models, and concurrency limits' };
      default:
        return { title: 'AiBotCall Dashboard', subtitle: '' };
    }
  };

  const pageInfo = getPageTitle();

  return (
    <div className="flex h-screen bg-[#080c14] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        onQuickCall={() => setIsQuickCallOpen(true)}
        onSelectProfileSection={setProfileSection}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onRefresh={refreshCurrentView}
          onQuickCall={() => setIsQuickCallOpen(true)}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 overflow-y-auto bg-[#080c14]">
          {activeTab === 'overview' && (
            <Overview
              onSelectCall={handleSelectCall}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}
          {activeTab === 'profile' && (
            <Profile
              user={user}
              onUpdateUser={(updated) => setUser(updated)}
              initialSection={profileSection}
              onSectionChange={(sec) => setProfileSection(sec)}
            />
          )}
          {activeTab === 'agents' && <Agents />}
          {activeTab === 'numbers' && <PhoneNumbers />}
          {activeTab === 'campaigns' && <Campaigns />}
          {activeTab === 'leads' && (
            <Leads
              onQuickCallPhone={() => {
                setIsQuickCallOpen(true);
              }}
            />
          )}
          {activeTab === 'calls' && <Calls onSelectCall={handleSelectCall} />}
          {activeTab === 'referrals' && (
            <Profile
              user={user}
              onUpdateUser={(updated) => setUser(updated)}
              initialSection="referrals"
              onSectionChange={(sec) => setProfileSection(sec)}
            />
          )}
          {activeTab === 'integrations' && <Integrations user={user} />}
          {activeTab === 'knowledge' && <KnowledgeBase />}
          {activeTab === 'webhooks' && <Webhooks />}
          {activeTab === 'suppression' && <Suppression />}
          {activeTab === 'apikeys' && <ApiKeys />}
          {activeTab === 'billing' && (
            <Profile
              user={user}
              onUpdateUser={(updated) => setUser(updated)}
              initialSection="billing"
              onSectionChange={(sec) => setProfileSection(sec)}
            />
          )}
          {activeTab === 'team' && <Team />}
          {activeTab === 'admin' && <SuperAdmin />}
          {activeTab === 'tester' && <Tester />}
          {activeTab === 'settings' && <Settings user={user} />}
        </main>
      </div>

      {/* Call Detail Modal */}
      {selectedCall && (
        <CallDetailModal
          call={selectedCall}
          webhookDeliveries={callWebhookDeliveries}
          onClose={() => setSelectedCall(null)}
          onRefresh={() => handleSelectCall(selectedCall)}
        />
      )}

      {/* Quick Outbound AI Call Modal */}
      <QuickCallModal
        isOpen={isQuickCallOpen}
        onClose={() => setIsQuickCallOpen(false)}
        onSuccess={() => {
          alert('Call queued! Telephony provider is dialing.');
          if (activeTab === 'calls') {
            refreshCurrentView();
          }
        }}
      />
    </div>
  );
};

export default App;
