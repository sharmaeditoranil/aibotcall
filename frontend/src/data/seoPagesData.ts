export interface SeoFaq {
  q: string;
  a: string;
}

export interface SeoFeature {
  title: string;
  desc: string;
  iconName: string;
}

export interface SeoPageData {
  slug: string;
  category: 'product' | 'solution' | 'trust';
  categoryLabel: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  heroBadge: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  overview: string[];
  workflowTitle?: string;
  workflowSteps?: string[];
  keyCapabilities: SeoFeature[];
  industryUseCases?: {
    headline: string;
    points: string[];
  };
  comparisonVsTraditional?: {
    traditionalTitle: string;
    traditionalPoints: string[];
    aiTitle: string;
    aiPoints: string[];
  };
  geoAnswerBlock: {
    question: string;
    answer: string;
  };
  faqs: SeoFaq[];
  relatedSlugs: string[];
}

export const SEO_PAGES_DATA: Record<string, SeoPageData> = {
  // 1. Core Pillar: AI Voice Calling Software in India
  'ai-voice-calling-software': {
    slug: 'ai-voice-calling-software',
    category: 'product',
    categoryLabel: 'Product Pillar',
    metaTitle: 'AI Voice Calling Software in India | AiBotCall Platform',
    metaDescription: 'Enterprise AI Voice Calling Software in India. Automate inbound and outbound calls with sub-500ms latency, Hindi/English speech, and instant CRM sync.',
    h1: 'AI Voice Calling Software in India for High-Converting Outreach',
    tagline: 'Empower your sales, admissions, and support teams with conversational voice AI that dials instantly, speaks natural Indian languages, qualifies leads, and syncs directly to your CRM.',
    heroBadge: 'Enterprise Voice AI Platform',
    primaryKeyword: 'AI Voice Calling Software in India',
    secondaryKeywords: ['AI Calling Software', 'AI Voice Call Automation', 'AI Phone Agent India', 'Automated Voice Calling Software', 'AI Voice Bot India'],
    overview: [
      'AiBotCall is a next-generation AI Voice Calling Software built specifically for Indian businesses. Operating on high-availability Indian telecom infrastructure (Exotel Carrier Trunk) and OpenAI Realtime speech-to-speech models, AiBotCall delivers human-like phone conversations with sub-500ms audio latency.',
      'Unlike traditional robotic IVR systems that force callers through endless keypad menus, AiBotCall listens actively, handles natural customer interruptions (barge-in), responds with authentic Indian conversational cadence (Hindi, Hinglish, and English), and updates lead statuses in real time.'
    ],
    workflowTitle: 'End-to-End Voice AI Calling Workflow',
    workflowSteps: [
      'Lead Generated on Website / Ad Campaign',
      'Webhook Dispatches in Under 5 Seconds',
      'AiBotCall Voice Agent Dials Customer Phone',
      'Human-Grade Speech-to-Speech Conversation',
      'Lead Qualified & Sentiment Tagged',
      'CRM Updated & WhatsApp Follow-up Sent via AiBotFlow'
    ],
    keyCapabilities: [
      {
        title: 'Sub-500ms Conversational Latency',
        desc: 'Delivers instantaneous Indian cadence with zero unnatural pauses. Customers experience fluid, authentic, human-level conversation.',
        iconName: 'Zap'
      },
      {
        title: 'Native Hindi, Hinglish & English Cadence',
        desc: 'Trained on natural Indian conversational phrasing, honorifics (ji, sir, maam), numbers, and colloquial dialect nuances.',
        iconName: 'Bot'
      },
      {
        title: 'Per-Second Billing at Flat ₹4.87/Min',
        desc: 'Transparent pricing with 0 hidden telecom markups. Unanswered calls or busy lines are billed at exactly ₹0.',
        iconName: 'CreditCard'
      },
      {
        title: 'Instant Webhook & CRM Synchronization',
        desc: 'Automatically delivers call audio recordings, turn-by-turn transcripts, and AI lead summaries to your CRM and WhatsApp.',
        iconName: 'Send'
      }
    ],
    geoAnswerBlock: {
      question: 'What is AiBotCall and how does AI Voice Calling Software work in India?',
      answer: 'AiBotCall is an enterprise AI Voice Calling Software in India that autonomously dials and answers phone calls using conversational speech-to-speech AI. When a lead submits an enquiry or a broadcast campaign is launched, AiBotCall initiates a carrier phone call via Exotel in under 5 seconds. The AI speaks in natural Hindi or English, understands user intent, answers questions, qualifies buying interest, and immediately synchronizes transcripts and appointment confirmations to CRMs and WhatsApp.'
    },
    faqs: [
      {
        q: 'How does AiBotCall differ from traditional IVR or robocallers?',
        a: 'Traditional IVR plays pre-recorded static audio clips and requires keypad buttons ("press 1 for sales"). AiBotCall uses conversational generative AI with sub-500ms speech-to-speech processing. It speaks freely, understands questions, adapts to context, and allows natural interruptions without keypad prompts.'
      },
      {
        q: 'What is the pricing model for AI voice calling in India?',
        a: 'AiBotCall provides flat ₹4.87 per calling minute with strict per-second billing pulse. Unanswered calls are never billed. Subscriptions start at ₹999/month for starter teams, including free calling minutes and lifetime credit validity.'
      },
      {
        q: 'Does it support Indian phone numbers and TRAI DND regulations?',
        a: 'Yes. AiBotCall routes calls through TRAI-compliant commercial virtual numbers (ExoPhones) with strict DND suppression and permitted calling time windows (9:00 AM to 8:00 PM IST).'
      }
    ],
    relatedSlugs: ['ai-voice-agent-india', 'outbound-ai-calling', 'website-lead-calling', 'pricing']
  },

  // 2. AI Voice Agent India
  'ai-voice-agent-india': {
    slug: 'ai-voice-agent-india',
    category: 'product',
    categoryLabel: 'Voice AI Agents',
    metaTitle: 'AI Voice Agent India | Human-like Hindi & English Calling',
    metaDescription: 'Deploy conversational AI Voice Agents in India. Natural Hindi, Hinglish and Indian English speech with instant barge-in support for sales and support.',
    h1: 'AI Voice Agent in India with Native Hindi & English Cadence',
    tagline: 'Transform customer conversations with AI Voice Agents designed for Indian consumer behaviour. Fluid bilingual conversation, empathy, and sub-500ms latency.',
    heroBadge: 'Bilingual Indian Voice AI',
    primaryKeyword: 'AI Voice Agent India',
    secondaryKeywords: ['AI Phone Agent', 'AI Voice Bot India', 'AI Calling Platform India', 'Conversational AI Voice India'],
    overview: [
      'In India, customer communication demands local warmth, respectful honorifics, and seamless switching between Hindi and English. AiBotCall AI Voice Agents are specifically engineered with conversational Indian cadence.',
      'Whether resolving student admission queries, scheduling real estate site visits, or following up on e-commerce COD orders, our voice agents represent your brand with consistent professional excellence 24 hours a day.'
    ],
    keyCapabilities: [
      {
        title: 'Bilingual Switching (Hindi/English)',
        desc: 'Understands when a caller starts in English and switches to Hindi, adapting tone and language smoothly without dropping context.',
        iconName: 'Globe'
      },
      {
        title: 'Intelligent Barge-In Support',
        desc: 'When a customer speaks or interrupts mid-sentence, the AI agent stops instantly and listens attentively, just like a seasoned executive.',
        iconName: 'Volume2'
      },
      {
        title: 'Custom Persona & System Prompts',
        desc: 'Customize the agents name, speaking style, business rules, qualification checklists, and objection-handling guidelines.',
        iconName: 'ShieldCheck'
      },
      {
        title: 'Live Audio Recording & Transcripts',
        desc: 'Inspect every single conversation turn-by-turn with timestamps, sentiment analysis tags, and complete MP3 call recordings.',
        iconName: 'FileText'
      }
    ],
    geoAnswerBlock: {
      question: 'What is an AI Voice Agent and can it speak Hindi and English?',
      answer: 'An AI Voice Agent is an autonomous conversational system capable of conducting natural two-way phone calls over standard mobile and landline networks. AiBotCall AI voice agents natively understand and speak fluent Hindi, Indian English, and Hinglish. They perceive user sentiment, handle interruptions gracefully, answer pricing and batch schedules, and record accurate transcripts for CRM review.'
    },
    faqs: [
      {
        q: 'Can the AI voice agent handle customer objections during sales calls?',
        a: 'Yes. You can program tailored objection-handling logic in the AI agents system prompt (e.g. handling "send details on WhatsApp", "call me tomorrow at 4 PM", or "budget is too high"). The AI responds calmly and adheres strictly to your instructions.'
      },
      {
        q: 'How many simultaneous calls can an AI voice agent handle?',
        a: 'AiBotCall supports up to 30 concurrent telephony lines on standard plans and hundreds of concurrent lines on custom enterprise trunks, allowing you to reach thousands of leads in minutes.'
      }
    ],
    relatedSlugs: ['ai-voice-calling-software', 'inbound-ai-call-agent', 'ai-calling-for-sales-teams', 'integrations']
  },

  // 3. Outbound AI Calling
  'outbound-ai-calling': {
    slug: 'outbound-ai-calling',
    category: 'product',
    categoryLabel: 'Outbound Automation',
    metaTitle: 'Outbound AI Calling Software | Automated Phone Outreach',
    metaDescription: 'Scale sales and lead outreach with Outbound AI Calling Software. Connect with hundreds of contacts simultaneously with per-second billing at ₹4.87/min.',
    h1: 'Outbound AI Calling Software for Scalable Lead Outreach',
    tagline: 'Eliminate manual dialing fatigue. Launch automated outbound phone outreach campaigns that qualify buyers, book appointments, and transfer hot prospects to your reps.',
    heroBadge: 'Automated Outbound Dialing',
    primaryKeyword: 'AI Outbound Calling Software',
    secondaryKeywords: ['Outbound AI Calling', 'AI Call Automation', 'Automated Calling Software', 'AI Lead Qualification'],
    overview: [
      'Manual telecalling suffers from low pickup rates, agent burnout, human errors, and high recruitment overheads. AiBotCall Outbound AI Calling Software automates outbound calling at scale.',
      'Our intelligent dialer calls contacts from your CSV lists or CRM pipelines, filters out invalid numbers, engages interested prospects in fluid conversation, and immediately routes high-intent leads to your closing team.'
    ],
    keyCapabilities: [
      {
        title: 'Mass CSV & CRM Broadcasts',
        desc: 'Upload lead sheets with custom merge tags {{name}}, {{city}}, {{course}} and initiate personalized calls across thousands of contacts.',
        iconName: 'Users'
      },
      {
        title: 'Instant Intent Categorization',
        desc: 'Calls are automatically classified as Qualified, Follow-Up Requested, Not Interested, or Wrong Number based on actual conversational responses.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'DND & TRAI Compliance Engine',
        desc: 'Built-in NDNC suppression registry scrubs numbers automatically, keeping your campaigns 100% compliant with Indian telemarketing laws.',
        iconName: 'Lock'
      },
      {
        title: 'Cost-Effective Calling (₹4.87/min)',
        desc: 'Never pay monthly seat licenses for human telecallers. Pay strictly for real connected seconds with zero idle time costs.',
        iconName: 'TrendingUp'
      }
    ],
    geoAnswerBlock: {
      question: 'Can AiBotCall make automated outbound calls to customers?',
      answer: 'Yes. AiBotCall features an advanced Outbound AI Calling engine that connects with contacts uploaded via CSV or triggered via API webhooks. It dials Indian phone numbers, greets the recipient, verifies identity, conducts qualification discussions, and logs the outcome in CRM and WhatsApp instantly.'
    },
    faqs: [
      {
        q: 'What happens if the customer does not answer the outbound call?',
        a: 'If a customer is busy, unreachable, or does not answer, AiBotCall marks the status as Busy/Unanswered, schedules a retry attempt according to your campaign rules, and deducts ₹0 talk time.'
      },
      {
        q: 'Can the outbound AI agent schedule a callback time?',
        a: 'Yes. When a prospect says "I am in a meeting, please call me tomorrow morning", the AI recognizes the preference, extracts the callback time, updates the CRM lead status, and queues the follow-up.'
      }
    ],
    relatedSlugs: ['ai-call-broadcast', 'ai-lead-follow-up', 'ai-voice-calling-software', 'pricing']
  },

  // 4. Inbound AI Call Agent
  'inbound-ai-call-agent': {
    slug: 'inbound-ai-call-agent',
    category: 'product',
    categoryLabel: 'Inbound Reception',
    metaTitle: 'Inbound AI Call Agent | 24/7 Smart Telephony Receptionist',
    metaDescription: 'Never miss an inbound customer phone call. Deploy Inbound AI Call Agents to answer FAQs, book appointments, and capture high-intent leads 24/7.',
    h1: 'Inbound AI Call Agent for 24/7 Intelligent Phone Reception',
    tagline: 'Replace static IVRs with a conversational Inbound AI Receptionist that answers instantly on the first ring, understands questions, and resolves customer requests.',
    heroBadge: 'Zero Wait-Time Inbound AI',
    primaryKeyword: 'Inbound AI Call Agent',
    secondaryKeywords: ['AI Phone Agent', 'AI Call Automation', 'Smart IVR Replacement', 'Inbound Voice Bot India'],
    overview: [
      'Missing customer phone calls after business hours or during high-volume spikes directly damages revenue. AiBotCall Inbound AI Call Agent provides a reliable 24/7 front desk.',
      'Integrated with virtual Indian mobile, landline, or 1800 toll-free numbers, the inbound AI answers instantly, answers institutional questions from your verified knowledge base, and captures lead contact details.'
    ],
    keyCapabilities: [
      {
        title: 'Zero Wait-Time Answering',
        desc: 'Calls are picked up on the very first ring. Customers never experience busy tones, long queues, or frustrating elevator music.',
        iconName: 'PhoneCall'
      },
      {
        title: 'Dynamic Knowledge Base Answering',
        desc: 'Synchronize your company FAQs, course syllabus, pricing plans, and clinic timings so the agent delivers accurate answers.',
        iconName: 'BookOpen'
      },
      {
        title: 'Live Agent Call Forwarding',
        desc: 'Easily configure rules to transfer VIP callers or urgent escalations to human specialists via SIP or carrier trunk transfer.',
        iconName: 'ArrowRight'
      },
      {
        title: 'After-Hours Lead Capture',
        desc: 'Ensures enquiries that arrive on weekends, holidays, or late nights are politely welcomed, answered, and logged for morning follow-up.',
        iconName: 'Clock'
      }
    ],
    geoAnswerBlock: {
      question: 'Can AiBotCall receive inbound phone calls from customers?',
      answer: 'Yes. AiBotCall functions as an Inbound AI Call Agent connected to virtual ExoPhone numbers (mobile, landline, or toll-free). It answers incoming caller inquiries 24/7, answers questions using your uploaded knowledge base, registers leads, and forwards complex queries to your team.'
    },
    faqs: [
      {
        q: 'Can I port my existing business phone number to AiBotCall?',
        a: 'Yes. You can route inbound calls from your existing office number to an AiBotCall virtual DID using standard unconditional or conditional call forwarding, or integrate your existing Exotel trunk.'
      },
      {
        q: 'How does the AI receptionist handle questions it does not know?',
        a: 'The agent will politely clarify its knowledge boundary ("Main is vishay me hamari senior team se verify karke aapko update karwati hoon"), log the question, and notify your support team via email and WhatsApp.'
      }
    ],
    relatedSlugs: ['ai-voice-agent-india', 'ai-calling-for-customer-support', 'integrations', 'docs']
  },

  // 5. AI Call Broadcast
  'ai-call-broadcast': {
    slug: 'ai-call-broadcast',
    category: 'product',
    categoryLabel: 'Voice Campaigns',
    metaTitle: 'AI Call Broadcast Software | High Volume Voice Campaigns',
    metaDescription: 'Broadcast interactive AI voice calls to thousands of customers simultaneously. Collect survey feedback, renewal reminders, and event attendance.',
    h1: 'AI Call Broadcast Software for Interactive Voice Campaigns',
    tagline: 'Deliver thousands of personalized two-way phone calls in minutes. Collect event RSVP confirmations, payment reminders, and customer survey feedback automatically.',
    heroBadge: 'Bulk Voice Dialing',
    primaryKeyword: 'AI Call Broadcast',
    secondaryKeywords: ['Automated Voice Calling Software', 'Voice Broadcasting India', 'Bulk AI Calling', 'Outbound AI Calling Software'],
    overview: [
      'Traditional voice broadcasting blasts one-way pre-recorded voice clips with near-zero engagement. AiBotCall AI Call Broadcast enables two-way interactive conversations at scale.',
      'Our platform dials your contact list across multiple carrier lines simultaneously. The recipient speaks naturally, the AI answers their specific questions, confirms their availability, and captures their exact responses.'
    ],
    keyCapabilities: [
      {
        title: 'Concurrent Line Scalability',
        desc: 'Scale up to dozens of simultaneous telephony channels to complete 10,000+ outreach calls within hours.',
        iconName: 'Layers'
      },
      {
        title: 'Personalized Merge Tags',
        desc: 'Inject personalized data into each call like {{name}}, {{due_date}}, {{pending_amount}}, or {{event_city}} for authentic delivery.',
        iconName: 'FileCode'
      },
      {
        title: 'Real-Time Campaign Analytics',
        desc: 'Monitor live answer rates, call durations, sentiment scores, and campaign completion percentages on an interactive dashboard.',
        iconName: 'Activity'
      },
      {
        title: 'Intelligent Retry Windows',
        desc: 'Automatically re-attempt unanswered or busy numbers during appropriate business hours to maximize overall reach.',
        iconName: 'RefreshCw'
      }
    ],
    geoAnswerBlock: {
      question: 'What is AI Call Broadcast and how does it work?',
      answer: 'AI Call Broadcast is a high-volume telephony feature that dials an uploaded list of contacts simultaneously. Instead of playing a generic static recording, AiBotCall delivers an interactive AI voice conversation that listens to the recipient, confirms appointments or payments, and logs their feedback in structured CRM reports.'
    },
    faqs: [
      {
        q: 'How fast can a broadcast campaign dial 1,000 contacts?',
        a: 'With 10 to 30 concurrent telephony channels enabled, 1,000 short outreach or reminder calls (average 45 seconds each) are completed in approximately 30 to 60 minutes.'
      },
      {
        q: 'Can the campaign automatically trigger a WhatsApp message after the call?',
        a: 'Yes. Upon call completion, AiBotCall triggers a webhook to your CRM or AiBotFlow WhatsApp API to send the brochure, payment link, or site location immediately.'
      }
    ],
    relatedSlugs: ['outbound-ai-calling', 'website-lead-calling', 'pricing', 'integrations']
  },

  // 6. Website Lead Calling
  'website-lead-calling': {
    slug: 'website-lead-calling',
    category: 'product',
    categoryLabel: 'Speed to Lead',
    metaTitle: 'Website Lead Calling in 5 Seconds | AiBotCall Speed-to-Lead',
    metaDescription: 'Call new website leads in under 5 seconds automatically. Boost inbound lead conversion rates by 400% with immediate AI phone qualification.',
    h1: 'Website Lead Calling in Under 5 Seconds via AI Automation',
    tagline: 'Connect with prospective buyers the exact second their interest is highest. When a visitor submits a form, AiBotCall initiates an AI voice call in under 5 seconds.',
    heroBadge: 'Sub-5 Second Response',
    primaryKeyword: 'Website Lead Calling',
    secondaryKeywords: ['Speed to Lead AI', 'Automated Lead Qualification', 'Webhook Trigger Calling', 'AI Calling Platform India'],
    overview: [
      'Lead response research proves that reaching a prospect within 5 minutes makes them 21 times more likely to convert compared to waiting 30 minutes. AiBotCall cuts that delay down to 5 seconds.',
      'By connecting your website forms, landing page builders, or Facebook Lead Ads via webhooks, AiBotCall instantly dials the prospect while they are still looking at your screen, answering questions and securing the meeting.'
    ],
    keyCapabilities: [
      {
        title: '5-Second Instant Dispatch',
        desc: 'Our webhook listener triggers Exotel telecom trunks in milliseconds, ringing the prospects phone while their purchase intent is peak.',
        iconName: 'Zap'
      },
      {
        title: 'Form Field Context Injection',
        desc: 'The AI knows the prospects name, selected course, budget, or preferred location and references them naturally in the opening greeting.',
        iconName: 'FileText'
      },
      {
        title: 'Lead Qualification & BANT Scoring',
        desc: 'Asks crucial qualification criteria (budget, authority, timeline, specific requirements) and classifies leads as Hot, Warm, or Cold.',
        iconName: 'Award'
      },
      {
        title: 'Instant WhatsApp Follow-up Sync',
        desc: 'Connects with AiBotFlow WhatsApp CRM to send PDF brochures, portfolio links, or meeting confirmations immediately upon hangup.',
        iconName: 'Send'
      }
    ],
    geoAnswerBlock: {
      question: 'Can an AI voice agent automatically call a website lead?',
      answer: 'Yes. When a prospective customer submits a lead form on WordPress, Webflow, Shopify, or Facebook Ads, a webhook payload is sent to AiBotCall. AiBotCall automatically initiates an outbound carrier phone call to the customer in under 5 seconds, speaks politely, clarifies requirements, and syncs the qualification summary to your CRM.'
    },
    faqs: [
      {
        q: 'Which website form builders and landing pages are supported?',
        a: 'Any platform that supports webhooks can trigger calls, including Elementor, WPForms, Contact Form 7, Webflow, Unbounce, Typeform, Google Forms, and Zapier/Make/Pabbly.'
      },
      {
        q: 'What if the customer submitted the form at 11:00 PM at night?',
        a: 'AiBotCall respects TRAI legal calling windows (9:00 AM to 8:00 PM IST). If an enquiry arrives after hours, the call is queued and automatically dispatched promptly at 9:01 AM the next morning.'
      }
    ],
    relatedSlugs: ['ai-voice-calling-software', 'ai-lead-follow-up', 'integrations', 'docs']
  },

  // 7. AI Lead Follow-Up
  'ai-lead-follow-up': {
    slug: 'ai-lead-follow-up',
    category: 'product',
    categoryLabel: 'Sales Cadence',
    metaTitle: 'AI Lead Follow-Up System | Automated Speed-to-Lead Software',
    metaDescription: 'Automate multi-touch lead follow-up phone calls. Re-engage cold leads, follow up after demos, and ensure zero opportunities fall through the cracks.',
    h1: 'AI Lead Follow-Up Automation for High-Velocity Sales',
    tagline: 'Turn neglected CRM leads into closed deals. Deploy automated multi-touch AI voice follow-ups that call prospects at optimal intervals until they engage.',
    heroBadge: 'Multi-Touch Sales Follow-Up',
    primaryKeyword: 'AI Lead Follow-Up',
    secondaryKeywords: ['Speed to Lead AI', 'Automated Lead Qualification', 'AI Outbound Calling Software', 'AI Call Automation'],
    overview: [
      'Over 60% of potential sales pipeline is lost simply because sales reps forget to make the 3rd or 4th follow-up call. AiBotCall automates persistent, courteous follow-up cadences.',
      'Our AI voice agent checks in on prospects after quotes have been emailed, confirms whether demo attendees have questions, and revives stale leads sitting dormant in your CRM.'
    ],
    keyCapabilities: [
      {
        title: 'Automated Multi-Touch Cadences',
        desc: 'Schedule intelligent follow-up touches: Day 1 instant call, Day 3 check-in, Day 7 final touch, and Day 14 reactivation.',
        iconName: 'Clock'
      },
      {
        title: 'Contextual Memory Across Touches',
        desc: 'The AI references earlier discussions ("Aapne pichle hafte fees structure ke baare me poocha tha...") to build rapport and continuity.',
        iconName: 'Bot'
      },
      {
        title: 'WhatsApp + Voice Synergy',
        desc: 'Synchronizes with AiBotFlow WhatsApp CRM to send follow-up catalog links, case studies, or booking links after every voice interaction.',
        iconName: 'MessageSquare'
      },
      {
        title: 'Sentiment & Drop-Off Analytics',
        desc: 'Identify why leads stall by analyzing aggregate transcript sentiments and objections across thousands of follow-up calls.',
        iconName: 'TrendingUp'
      }
    ],
    geoAnswerBlock: {
      question: 'How does AI lead follow-up help sales teams in India?',
      answer: 'AI lead follow-up automatically calls prospects who previously expressed interest but have not yet purchased. It checks if they received proposals, answers lingering questions, and identifies whether they are ready to purchase, freeing sales teams to focus solely on closing qualified deals.'
    },
    faqs: [
      {
        q: 'Can the AI detect if a lead has already purchased or unsubscribed?',
        a: 'Yes. If a lead status is changed to Won or DNC in your CRM, our webhook listener immediately removes them from future calling sequences.'
      },
      {
        q: 'What is the recommended follow-up frequency?',
        a: 'Best practices for Indian B2B and high-ticket B2C recommend 3 to 4 touches spread over 10 days, followed by WhatsApp check-ins.'
      }
    ],
    relatedSlugs: ['website-lead-calling', 'outbound-ai-calling', 'ai-calling-for-sales-teams', 'integrations']
  },

  // 8. AI Appointment Booking
  'ai-appointment-booking': {
    slug: 'ai-appointment-booking',
    category: 'product',
    categoryLabel: 'Calendar Scheduling',
    metaTitle: 'AI Appointment Booking Software | Automated Phone Scheduling',
    metaDescription: 'Schedule client meetings, clinic appointments, and site visits over phone calls with AI Appointment Booking Software. Syncs with Google Calendar.',
    h1: 'AI Appointment Booking & Scheduling Over Phone Calls',
    tagline: 'Book confirmed meetings directly on phone calls. The AI voice agent checks calendar slots, negotiates convenient times with callers, and sends calendar invites.',
    heroBadge: 'Voice Calendar Scheduling',
    primaryKeyword: 'AI Appointment Booking',
    secondaryKeywords: ['AI Phone Agent', 'Automated Voice Calling Software', 'AI Voice Bot India', 'AI Call Automation'],
    overview: [
      'Back-and-forth messaging and booking links often cause high friction and lead drop-off. AiBotCall allows prospects to schedule appointments conversationally over the phone.',
      'The AI voice agent suggests open time slots, checks caller preferences, confirms their booking, and triggers Google Calendar or CRM event invites with SMS and WhatsApp confirmations.'
    ],
    keyCapabilities: [
      {
        title: 'Live Calendar Slot Checking',
        desc: 'Connects with Google Calendar, Calendly, or custom CRM APIs to check real-time availability and eliminate double-booking.',
        iconName: 'Calendar'
      },
      {
        title: 'Natural Rescheduling & Cancellations',
        desc: 'When clients call to postpone an appointment, the AI smoothly rearranges the booking and updates your master team schedule.',
        iconName: 'Clock'
      },
      {
        title: 'No-Show Reduction Reminders',
        desc: 'Automates an outbound confirmation call 2 hours prior to the meeting to verify attendee availability and maximize show-up rates.',
        iconName: 'ShieldCheck'
      },
      {
        title: 'Instant Confirmation via WhatsApp',
        desc: 'Sends location pin, doctor preparation guidelines, or Zoom meeting credentials via AiBotFlow WhatsApp immediately after the call.',
        iconName: 'Send'
      }
    ],
    geoAnswerBlock: {
      question: 'Can an AI voice agent schedule appointments over a phone call?',
      answer: 'Yes. AiBotCall AI voice agents can check live calendar availability, offer convenient morning or afternoon slots to the caller, confirm details (name, purpose of meeting, phone number), create the calendar event, and dispatch confirmation messages over WhatsApp.'
    },
    faqs: [
      {
        q: 'Which calendar tools integrate with AiBotCall?',
        a: 'Google Calendar, Microsoft Outlook 365, Calendly, and any CRM calendar supported by webhooks or Zapier/Pabbly.'
      },
      {
        q: 'Does it reduce no-show rates for clinics and real estate?',
        a: 'Yes. Customers utilizing our automated 2-hour pre-appointment voice reminder report an average 35% reduction in appointment no-shows.'
      }
    ],
    relatedSlugs: ['inbound-ai-call-agent', 'ai-calling-for-healthcare', 'ai-voice-agent-for-real-estate', 'integrations']
  },

  // 9. AI Call Automation & Webhooks
  'ai-call-automation': {
    slug: 'ai-call-automation',
    category: 'product',
    categoryLabel: 'Developer Platform',
    metaTitle: 'AI Call Automation & Webhook Integration | AiBotCall Platform',
    metaDescription: 'Programmatic AI Voice Calling with REST APIs and Webhooks. Trigger sub-500ms voice calls, parse transcripts, and sync CRM data automatically.',
    h1: 'AI Call Automation Engine with Webhooks & Developer APIs',
    tagline: 'Trigger phone calls programmatically from any backend application, CRM, or marketing workflow with HMAC-SHA256 authenticated webhooks and REST endpoints.',
    heroBadge: 'Developer-First Telephony',
    primaryKeyword: 'AI Call Automation',
    secondaryKeywords: ['Webhook Trigger Calling', 'AI Calling Platform India', 'AI Voice Calling Software', 'Voice API India'],
    overview: [
      'AiBotCall is designed for developers, digital agencies, and engineering teams that require robust programmatic telephony control without dealing with complex telecom SIP stacks.',
      'Using our clean REST API and webhook architecture, you can trigger outbound calls, receive real-time call termination payloads, stream live transcripts, and query call analytics effortlessly.'
    ],
    keyCapabilities: [
      {
        title: 'HMAC SHA-256 Signed Webhooks',
        desc: 'Every call event payload is cryptographically signed with your unique webhook secret in the X-AiBotCall-Signature header.',
        iconName: 'Lock'
      },
      {
        title: 'Structured JSON Payload Schemas',
        desc: 'Receive comprehensive call metadata: call_id, duration_seconds, recording_url, qualification_status, and turn-by-turn transcript.',
        iconName: 'FileCode'
      },
      {
        title: 'Dynamic Variable Passing',
        desc: 'Pass custom parameters (e.g. invoice_id, customer_tier, preferred_language) into the call payload to guide the AI conversation.',
        iconName: 'Cpu'
      },
      {
        title: 'Per-Second Billing API',
        desc: 'Query real-time wallet balances, top-up minutes via Razorpay API, and monitor talk time consumption programmatically.',
        iconName: 'CreditCard'
      }
    ],
    geoAnswerBlock: {
      question: 'Can AiBotCall trigger calls through webhooks and APIs?',
      answer: 'Yes. Developers can initiate AI phone calls by sending an HTTP POST request to /api/v1/calls/dispatch with the destination phone number and custom context variables. When the call finishes, AiBotCall delivers an HMAC-signed webhook containing audio recordings, transcripts, duration, and qualification results.'
    },
    faqs: [
      {
        q: 'Which programming languages have ready code examples?',
        a: 'Our documentation includes copy-paste ready code examples in cURL, Python, Node.js, and PHP.'
      },
      {
        q: 'Can webhooks be tested locally during development?',
        a: 'Yes. You can route webhook payloads to local tunneling tools like ngrok or inspect delivery logs directly in the AiBotCall dashboard Webhooks tab.'
      }
    ],
    relatedSlugs: ['docs', 'integrations', 'website-lead-calling', 'pricing']
  },

  // 10. Integrations Hub
  'integrations': {
    slug: 'integrations',
    category: 'product',
    categoryLabel: 'Ecosystem',
    metaTitle: 'AiBotCall Integrations | WhatsApp, CRMs, Webhooks & APIs',
    metaDescription: 'Connect AiBotCall with AiBotFlow WhatsApp CRM, HubSpot, Salesforce, Zoho, Google Sheets, Zapier and Pabbly for seamless automated calling.',
    h1: 'Seamless Integrations with CRMs, WhatsApp & Marketing Tools',
    tagline: 'Connect AiBotCall to your existing business stack in under 5 minutes. Sync leads, transcripts, recordings, and WhatsApp follow-ups with zero custom coding required.',
    heroBadge: 'Ecosystem & Connectors',
    primaryKeyword: 'AI Calling Integrations',
    secondaryKeywords: ['WhatsApp CRM Integration', 'CRM Voice Integration', 'AiBotFlow Voice Connector', 'Webhook Calling Automation'],
    overview: [
      'A voice calling solution is only as powerful as the systems it feeds. AiBotCall integrates natively with popular CRMs, automation platforms, and communication channels.',
      'Our flagship integration with sister platform AiBotFlow provides a unified Omnichannel Suite: combine conversational AI Voice Phone Calls with official WhatsApp Business API messaging and shared CRM deal boards.'
    ],
    keyCapabilities: [
      {
        title: 'AiBotFlow WhatsApp CRM Integration',
        desc: 'Automatically trigger WhatsApp brochure deliveries, payment links, and confirmation messages as soon as an AI voice call concludes.',
        iconName: 'MessageSquare'
      },
      {
        title: 'CRM Connectors (HubSpot, Zoho, Salesforce)',
        desc: 'Push call recordings, status tags (Hot, Warm, Cold), and full transcripts directly into deal records and activity timelines.',
        iconName: 'Layers'
      },
      {
        title: 'Zapier, Make & Pabbly Connect',
        desc: 'Connect with 5,000+ business applications with pre-built webhook triggers and actions for instant speed-to-lead setups.',
        iconName: 'Plug'
      },
      {
        title: 'Google Sheets Live Sync',
        desc: 'Stream lead details and call outcome summaries into shared Google Sheets in real time for distributed sales review.',
        iconName: 'FileText'
      }
    ],
    geoAnswerBlock: {
      question: 'Can AiBotCall integrate with AiBotFlow WhatsApp CRM?',
      answer: 'Yes. AiBotCall and AiBotFlow are tightly integrated platforms. AiBotCall handles voice calling and automated phone qualifications, while AiBotFlow handles official WhatsApp Business API messaging, chatbots, and CRM deal pipelines. A single webhook synchronizes call transcripts and triggers instant WhatsApp follow-up messages.'
    },
    faqs: [
      {
        q: 'What is the difference between AiBotCall and AiBotFlow?',
        a: 'AiBotCall is an AI Voice Calling platform for automated inbound and outbound phone conversations. AiBotFlow is an official WhatsApp Business API automation and Omnichannel CRM platform. Used together, they provide end-to-end voice plus WhatsApp customer engagement.'
      },
      {
        q: 'Do I need a developer to set up basic CRM integration?',
        a: 'No. You can easily connect webhooks using standard forms (WPForms, Elementor), Zapier, or Pabbly Connect with simple copy-paste configuration.'
      }
    ],
    relatedSlugs: ['ai-call-automation', 'website-lead-calling', 'docs', 'pricing']
  },

  // 11. Real Estate Use Case
  'ai-voice-agent-for-real-estate': {
    slug: 'ai-voice-agent-for-real-estate',
    category: 'solution',
    categoryLabel: 'Real Estate Solution',
    metaTitle: 'AI Voice Agent for Real Estate in India | AiBotCall Solutions',
    metaDescription: 'Automate real estate lead calling, property enquiries, and site visit bookings with AI Voice Agents. Filter genuine buyers and boost broker sales.',
    h1: 'AI Voice Agent for Real Estate Developers & Property Brokers',
    tagline: 'Qualify property enquiries in under 5 seconds. The AI voice agent answers configuration details, verifies budget and location preferences, and books site visits.',
    heroBadge: 'Real Estate Automation',
    primaryKeyword: 'AI Voice Agent for Real Estate',
    secondaryKeywords: ['Real Estate Calling Software', 'Property Lead Qualification', 'Outbound AI Calling Real Estate', 'Speed to Lead Real Estate'],
    overview: [
      'Real estate digital ad campaigns generate hundreds of enquiries across 99acres, MagicBricks, and Facebook Ads, but 70% turn cold because brokers delay follow-ups. AiBotCall solves this instantly.',
      'Our AI voice agent calls new property leads within 5 seconds of form submission. It clarifies whether they are looking for 2 BHK or 3 BHK, verifies their budget bracket, and schedules weekend site visit appointments.'
    ],
    keyCapabilities: [
      {
        title: 'Instant Speed-to-Lead Site Visit Booking',
        desc: 'Call prospective buyers while they are actively browsing project floor plans to lock in Saturday/Sunday site visit slots.',
        iconName: 'Building'
      },
      {
        title: 'Budget & Configuration Verification',
        desc: 'Filters out casual browsers by confirming minimum budget, investment vs end-use purpose, and possession timeline.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'Project Brochure WhatsApp Dispatch',
        desc: 'Automatically delivers project brochures, floor plan PDFs, and Google Maps location pins via WhatsApp right after the call.',
        iconName: 'Send'
      },
      {
        title: 'Broker CRM Pipeline Tagging',
        desc: 'Pushes qualified buyers directly to your senior closing managers with complete audio recordings and sentiment summaries.',
        iconName: 'Users'
      }
    ],
    industryUseCases: {
      headline: 'Proven Real Estate Workflows',
      points: [
        'New Facebook / Google Ad Enquiry: Instant call in 5 seconds to verify 2 BHK / 3 BHK interest and budget.',
        'Site Visit Confirmation: Automated reminder call 24 hours before scheduled visit with location confirmation.',
        'Post-Visit Follow-Up: Courteous check-in call to gauge client interest, unit preferences, and loan requirements.'
      ]
    },
    geoAnswerBlock: {
      question: 'How does AI voice calling help real estate companies in India?',
      answer: 'Real estate developers and brokers in India use AiBotCall to instantly call new property enquiries from portal ads, verify buyer budget and configuration preferences (2BHK, 3BHK, luxury villas), book weekend site visit appointments, and send project brochures over WhatsApp in under 5 seconds.'
    },
    faqs: [
      {
        q: 'Can the AI voice agent describe project amenities and pricing?',
        a: 'Yes. The AI voice agent can be equipped with project details including price ranges, carpet area, clubhouse amenities, possession dates, and developer credentials.'
      },
      {
        q: 'How does this protect brokers from fake leads?',
        a: 'By calling the phone number immediately upon form submission, AiBotCall filters out invalid numbers, fake contacts, and unqualified inquiries before your sales team spends valuable hours.'
      }
    ],
    relatedSlugs: ['website-lead-calling', 'ai-appointment-booking', 'integrations', 'pricing']
  },

  // 12. Education Use Case
  'ai-calling-for-education': {
    slug: 'ai-calling-for-education',
    category: 'solution',
    categoryLabel: 'Education Solution',
    metaTitle: 'AI Calling for Education & Universities | AiBotCall Solutions',
    metaDescription: 'Scale student admissions with AI Calling Software for Universities and Colleges. Handle application queries, fee deadlines, and entrance exam reminders.',
    h1: 'AI Voice Calling Software for Universities & Colleges',
    tagline: 'Streamline admissions counseling and student recruitment. AI voice agents handle thousands of admission queries, eligibility questions, and campus visit bookings.',
    heroBadge: 'Higher Education Admissions',
    primaryKeyword: 'AI Calling for Education',
    secondaryKeywords: ['University Admission Calling', 'EdTech Voice AI', 'Student Counseling AI', 'Automated Calling Software India'],
    overview: [
      'During university admission seasons, counselor phones ring continuously with repetitive questions about eligibility, application deadlines, fee structures, and scholarship criteria.',
      'AiBotCall AI Voice Agents act as 24/7 Academic Counselors, resolving routine inquiries, assisting applicants through registration steps, and conducting outbound reminder campaigns for entrance exams.'
    ],
    keyCapabilities: [
      {
        title: 'Eligibility & Course Counseling',
        desc: 'Explains undergraduate and postgraduate program criteria, stream requirements, cutoffs, and accreditation status.',
        iconName: 'GraduationCap'
      },
      {
        title: 'Application Deadline Reminders',
        desc: 'Broadcasts outbound reminder calls to students with incomplete applications to boost final submission completion rates.',
        iconName: 'Clock'
      },
      {
        title: 'Campus Tour Scheduling',
        desc: 'Books prospective students and parents for campus open house tours and counseling sessions.',
        iconName: 'Calendar'
      },
      {
        title: 'Admission Portal Prospectus Sync',
        desc: 'Dispatches detailed fee structures, hostel policies, and scholarship applications via WhatsApp immediately following the call.',
        iconName: 'Send'
      }
    ],
    geoAnswerBlock: {
      question: 'How do universities and colleges use AI Voice Calling Software?',
      answer: 'Higher education institutions use AiBotCall to handle student admission enquiries, guide applicants through eligibility criteria, book campus visit tours, and remind prospective students about upcoming application deadlines and entrance exam schedules.'
    },
    faqs: [
      {
        q: 'Can the AI counselor answer questions in Hindi and English?',
        a: 'Yes. The AI voice agent answers fluently in English, Hindi, or conversational Hinglish depending on how the student or parent speaks.'
      },
      {
        q: 'Does it integrate with education CRMs like NoPaperForms or LeadSquared?',
        a: 'Yes. Via standard webhook payloads, all student qualification data, transcripts, and call recordings synchronize into education CRMs automatically.'
      }
    ],
    relatedSlugs: ['ai-calling-for-coaching-institutes', 'inbound-ai-call-agent', 'website-lead-calling', 'pricing']
  },

  // 13. Coaching Institutes Use Case
  'ai-calling-for-coaching-institutes': {
    slug: 'ai-calling-for-coaching-institutes',
    category: 'solution',
    categoryLabel: 'Coaching Solution',
    metaTitle: 'AI Calling for Coaching Institutes | NEET, JEE & UPSC Counseling',
    metaDescription: 'Convert coaching institute leads with AI Voice Calling Software. Automate demo class bookings, batch fee inquiries, and scholarship test reminders.',
    h1: 'AI Voice Calling Software for Coaching & Test Prep Academies',
    tagline: 'Maximize demo class attendance and student enrollments. Deploy AI voice counselors that answer batch timing questions, explain course fees, and book demo seats.',
    heroBadge: 'Coaching & Test Prep AI',
    primaryKeyword: 'AI Calling for Coaching Institutes',
    secondaryKeywords: ['Coaching Lead Qualification', 'NEET JEE Voice AI', 'Student Enrollment Calling', 'Automated Calling Software'],
    overview: [
      'Competitive exam coaching institutes (NEET, JEE, UPSC, Banking, SSC) invest heavily in local ad campaigns, but students and parents evaluate multiple centers simultaneously.',
      'AiBotCall ensures your academy is the first to respond. The AI voice agent calls parents within seconds, explains teacher credentials and batch schedules, and reserves demo classroom seats.'
    ],
    keyCapabilities: [
      {
        title: 'Demo Class Reservation',
        desc: 'Reserves student seats for weekend demo lectures and shares center address pins with parents over WhatsApp.',
        iconName: 'Calendar'
      },
      {
        title: 'Scholarship Test (VSAT/ANTHE) Reminders',
        desc: 'Conducts outbound broadcast reminders to registered applicants before admission screening and scholarship tests.',
        iconName: 'Award'
      },
      {
        title: 'Fee Structure & Installment Guidance',
        desc: 'Explains monthly or lump-sum fee installment terms clearly, addressing parental concerns with authentic conversational cadence.',
        iconName: 'CreditCard'
      },
      {
        title: 'Batch Attendance & Parent Updates',
        desc: 'Automates attendance follow-up calls to parents when students are absent or parent-teacher meetings are scheduled.',
        iconName: 'PhoneCall'
      }
    ],
    geoAnswerBlock: {
      question: 'How do coaching institutes benefit from AI Voice Calling in India?',
      answer: 'Coaching institutes in Kota, Delhi, Hyderabad, and across India use AiBotCall to contact student leads within 5 seconds, explain batch timings and fee schedules, reserve seats for demo classes, and send scholarship test reminders, resulting in 4x higher enrollment conversions.'
    },
    faqs: [
      {
        q: 'Can the AI speak respectfully with parents in regional Indian accents?',
        a: 'Yes. The voice agent uses respectful Indian honorifics ("Namaste ji", "Aapka beta/beti") and maintains a supportive, academic, professional tone throughout.'
      },
      {
        q: 'Can we upload student lists from Excel/CSV for batch announcements?',
        a: 'Yes. You can upload standard CSV spreadsheets and trigger thousands of batch announcement calls with one click.'
      }
    ],
    relatedSlugs: ['ai-calling-for-education', 'website-lead-calling', 'ai-call-broadcast', 'pricing']
  },

  // 14. Healthcare Use Case
  'ai-calling-for-healthcare': {
    slug: 'ai-calling-for-healthcare',
    category: 'solution',
    categoryLabel: 'Healthcare Solution',
    metaTitle: 'AI Calling for Healthcare & Clinics | Patient Appointment AI',
    metaDescription: 'Automate doctor appointment bookings, diagnostic reminders, and patient check-ins with AI Calling Software for Clinics and Hospitals.',
    h1: 'AI Voice Calling Software for Clinics, Hospitals & Diagnostics',
    tagline: 'Deliver compassionate, efficient patient communication. AI voice agents manage appointment scheduling, diagnostic prep reminders, and surgery follow-ups 24/7.',
    heroBadge: 'Healthcare Voice AI',
    primaryKeyword: 'AI Calling for Healthcare',
    secondaryKeywords: ['Clinic Appointment AI', 'Hospital Voice Calling', 'Patient Reminder AI', 'AI Phone Agent India'],
    overview: [
      'Clinic reception desks face constant interruptions while attending to in-person patients. AiBotCall acts as a dedicated 24/7 Medical Telephony Receptionist.',
      'Our healthcare voice agent checks doctor OPD schedules, books patient appointments, provides fasting/preparation guidelines for diagnostic tests, and confirms appointments.'
    ],
    keyCapabilities: [
      {
        title: 'Doctor OPD Appointment Booking',
        desc: 'Checks doctor schedules, confirms consulting fees, and books time slots with minimal patient effort.',
        iconName: 'Calendar'
      },
      {
        title: 'Diagnostic Test Prep Instructions',
        desc: 'Calls patients prior to blood tests or scans to explain mandatory fasting hours and document requirements.',
        iconName: 'FileText'
      },
      {
        title: 'Post-Consultation & Discharge Check-Ins',
        desc: 'Conducts polite follow-up calls 48 hours post-discharge to inquire about recovery status and medication adherence.',
        iconName: 'ShieldCheck'
      },
      {
        title: 'Emergency Triage & Human Escalation',
        desc: 'Programmed to recognize medical emergencies and immediately route urgent calls to hospital triage staff.',
        iconName: 'PhoneCall'
      }
    ],
    geoAnswerBlock: {
      question: 'Can AI Voice Calling be used for healthcare and doctor appointments in India?',
      answer: 'Yes. Healthcare centers, dental chains, and diagnostic labs use AiBotCall to book doctor appointments, remind patients about test fasting requirements, confirm consultation timings, and minimize hospital front-desk queues while maintaining strict patient privacy.'
    },
    faqs: [
      {
        q: 'Does AiBotCall provide medical diagnoses?',
        a: 'No. The AI agent strictly handles administrative telephony: scheduling appointments, checking doctor availability, providing clinic timings, and sending directions.'
      },
      {
        q: 'How does it maintain patient data privacy?',
        a: 'AiBotCall follows strict healthcare privacy standards with encrypted call transmission, secure storage, and complete audit logging.'
      }
    ],
    relatedSlugs: ['ai-appointment-booking', 'inbound-ai-call-agent', 'security', 'pricing']
  },

  // 15. Sales Teams Use Case
  'ai-calling-for-sales-teams': {
    slug: 'ai-calling-for-sales-teams',
    category: 'solution',
    categoryLabel: 'Sales Acceleration',
    metaTitle: 'AI Calling for Sales Teams | SDR Automation & Lead Qualification',
    metaDescription: 'Supercharge your sales pipeline with AI Calling for Sales Teams. Automatically filter MQLs into SQLs and book meetings for your account executives.',
    h1: 'AI Voice Calling Software for High-Performance Sales Teams',
    tagline: 'Replace cold calling grind with automated AI qualification. The AI voice agent dials prospects, assesses budget and authority, and routes sales-ready leads to your closers.',
    heroBadge: 'Sales Development Automation',
    primaryKeyword: 'AI Voice Agent for Sales Teams',
    secondaryKeywords: ['AI Calling for Sales Teams', 'SDR Voice AI', 'Automated Lead Qualification', 'Sales Pipeline Automation'],
    overview: [
      'High-performing account executives should spend their days presenting proposals and closing deals, not dialing 100 unanswered numbers. AiBotCall acts as your autonomous SDR army.',
      'Our sales voice agent initiates outreach to MQLs, verifies purchase intent, handles initial pricing questions, and schedules calendar appointments directly with your senior sales representatives.'
    ],
    keyCapabilities: [
      {
        title: 'BANT Lead Qualification',
        desc: 'Conversationally uncovers Budget, Authority, Need, and Timeline, ensuring your human sales reps only talk to qualified prospects.',
        iconName: 'Award'
      },
      {
        title: 'Live Warm Call Transfers',
        desc: 'When a prospect indicates immediate purchase readiness, the AI seamlessly transfers the live call directly to an available closer.',
        iconName: 'ArrowRight'
      },
      {
        title: 'Call Transcript & Sentiment Intelligence',
        desc: 'Review concise AI summaries, key objection tags, and prospect pain points before your reps step into the discovery demo.',
        iconName: 'TrendingUp'
      },
      {
        title: 'CRM Deal Pipeline Automation',
        desc: 'Automatically upgrades qualified contacts from MQL to SQL status in your CRM with complete conversation timestamps.',
        iconName: 'CheckCircle2'
      }
    ],
    geoAnswerBlock: {
      question: 'How does AI voice calling help sales development teams?',
      answer: 'AiBotCall empowers sales teams by automating cold outreach and inbound lead qualification. Instead of manual dialing, the AI phone agent calls leads, handles initial discussions, determines buying intent, and books meetings on sales reps calendars, increasing sales productivity by up to 5x.'
    },
    faqs: [
      {
        q: 'Can the AI agent handle custom sales scripts and product questions?',
        a: 'Yes. You can upload custom sales playbooks, feature matrices, competitor battlecards, and objection-handling scripts directly into the agent dashboard.'
      },
      {
        q: 'What CRM tools can receive qualified leads from AiBotCall?',
        a: 'AiBotCall integrates with HubSpot, Salesforce, Zoho CRM, LeadSquared, Pipedrive, and AiBotFlow WhatsApp CRM.'
      }
    ],
    relatedSlugs: ['outbound-ai-calling', 'website-lead-calling', 'ai-lead-follow-up', 'integrations']
  },

  // 16. Customer Support Use Case
  'ai-calling-for-customer-support': {
    slug: 'ai-calling-for-customer-support',
    category: 'solution',
    categoryLabel: 'Support Automation',
    metaTitle: 'AI Voice Calling for Customer Support | 24/7 Tier-1 Resolution',
    metaDescription: 'Resolve Tier-1 customer support inquiries instantly with AI Voice Calling Software. Zero wait times, consistent answers, and human escalation support.',
    h1: 'AI Voice Calling for Customer Support & Helpdesk Operations',
    tagline: 'Deliver instant support resolutions on phone calls. The AI voice agent answers billing inquiries, order tracking, and account questions with zero customer hold times.',
    heroBadge: '24/7 Customer Service AI',
    primaryKeyword: 'AI Voice Calling for Customer Support',
    secondaryKeywords: ['Customer Support Voice AI', 'Call Center AI Automation', 'Inbound AI Call Agent', 'Smart IVR Replacement'],
    overview: [
      'Long hold times and frustrating support queues are the primary causes of customer churn. AiBotCall resolves Tier-1 customer queries with instantaneous voice assistance.',
      'Trained on your knowledge base, the voice agent checks order statuses, explains return policies, issues service tickets, and smoothly escalates complex disputes to human specialists.'
    ],
    keyCapabilities: [
      {
        title: 'Zero Hold-Time Ticket Resolution',
        desc: 'Answers every customer call on the first ring, resolving 60%+ of routine inquiries without human agent involvement.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'Order Tracking & Account Lookups',
        desc: 'Connects to your backend APIs to look up delivery tracking, payment receipts, and subscription statuses dynamically.',
        iconName: 'Search'
      },
      {
        title: 'Calm & Empathetic De-escalation',
        desc: 'Remains polite, patient, and courteous during frustrated customer calls, logging detailed issue notes for managerial review.',
        iconName: 'ShieldCheck'
      },
      {
        title: 'Seamless Escalation to Human Support',
        desc: 'Transfers complex issues or billing disputes to human agents with complete contextual briefing and transcript history.',
        iconName: 'ArrowRight'
      }
    ],
    geoAnswerBlock: {
      question: 'What is the difference between an AI Voice Agent and traditional IVR?',
      answer: 'Traditional IVR is a rigid menu tree that forces callers to press numeric keys ("Press 1 for accounts, press 2 for support") and cannot understand spoken intent. An AI Voice Agent utilizes conversational speech models: customers speak normally, the AI understands their issue, provides direct answers, and resolves problems without keypad navigation.'
    },
    faqs: [
      {
        q: 'Can the AI voice support agent generate tickets in Zendesk or Freshdesk?',
        a: 'Yes. AiBotCall can trigger webhooks to create and update support tickets with call recordings and transcripts attached.'
      },
      {
        q: 'How does it handle language preferences?',
        a: 'Callers can speak in English, Hindi, or conversational Hinglish, and the AI agent replies naturally in their chosen language.'
      }
    ],
    relatedSlugs: ['inbound-ai-call-agent', 'ai-voice-agent-india', 'security', 'integrations']
  },

  // 17. Security & Compliance
  'security': {
    slug: 'security',
    category: 'trust',
    categoryLabel: 'Enterprise Trust',
    metaTitle: 'Enterprise Telephony Security & TRAI Compliance | AiBotCall',
    metaDescription: 'Learn how AiBotCall ensures enterprise data security, carrier-grade encryption, TRAI DLT adherence, and strict NDNC suppression protections.',
    h1: 'Enterprise Telephony Security & Regulatory Compliance',
    tagline: 'Built on bank-grade security standards and carrier-level telecom compliance. Protect your customer data and ensure adherence to Indian telemarketing guidelines.',
    heroBadge: 'Security & Compliance',
    primaryKeyword: 'AI Telephony Security',
    secondaryKeywords: ['TRAI DND Compliance', 'Cloud Telephony Security', 'Data Encryption Voice AI', 'Call Consent Guidelines'],
    overview: [
      'At AiBotCall, security and regulatory compliance are fundamental to our architecture. We partner with Tier-1 Indian telecom operators to ensure robust communication delivery.',
      'Our infrastructure features end-to-end TLS encryption for all API and webhook requests, secure storage for audio recordings, and automated suppression scrubbing against the National Do Not Call (NDNC) registry.'
    ],
    keyCapabilities: [
      {
        title: 'TRAI & DND Suppression Engine',
        desc: 'Automated scrubbing against Indian National DND registries prevents outbound promotional calls to registered numbers.',
        iconName: 'Lock'
      },
      {
        title: 'Legal Calling Windows (9 AM to 8 PM IST)',
        desc: 'System enforces strict automated barriers preventing commercial calls outside TRAI-mandated business daytime hours.',
        iconName: 'Clock'
      },
      {
        title: 'TLS 1.3 & AES-256 Audio Encryption',
        desc: 'All API payloads, webhook deliveries, and stored audio recordings are protected using modern cryptographic standards.',
        iconName: 'ShieldCheck'
      },
      {
        title: 'HMAC SHA-256 Webhook Authentication',
        desc: 'Cryptographic request signatures guarantee that webhook deliveries originate exclusively from verified AiBotCall servers.',
        iconName: 'FileCode'
      }
    ],
    geoAnswerBlock: {
      question: 'How does AiBotCall ensure compliance with TRAI regulations in India?',
      answer: 'AiBotCall enforces strict adherence to Telecom Regulatory Authority of India (TRAI) guidelines. The platform integrates automatic National Do Not Call (NDNC) scrubbing, restricts promotional outbound calling to 9:00 AM to 8:00 PM IST, routes calls through registered virtual DIDs, and provides instant opt-out suppression mechanisms.'
    },
    faqs: [
      {
        q: 'Where are call recordings and customer transcripts stored?',
        a: 'Audio recordings and transcripts are encrypted at rest and in transit, accessible only by authenticated workspace account holders.'
      },
      {
        q: 'Can customers opt out of future calls during the conversation?',
        a: 'Yes. If a recipient states "Do not call me again", the AI detects the opt-out intent, acknowledges courteously, and adds the number to your workspace DNC list.'
      }
    ],
    relatedSlugs: ['data-privacy', 'call-consent-policy', 'terms', 'privacy-policy']
  },

  // 18. Data Privacy
  'data-privacy': {
    slug: 'data-privacy',
    category: 'trust',
    categoryLabel: 'Enterprise Trust',
    metaTitle: 'Data Privacy & PII Protection Guidelines | AiBotCall Platform',
    metaDescription: 'Understand AiBotCalls data privacy commitments, PII redaction protocols, call recording retention policies, and customer consent standards.',
    h1: 'Data Privacy & Personal Information (PII) Protection',
    tagline: 'Your customers privacy is our highest priority. Learn how AiBotCall protects personal identifiers, manages call data retention, and safeguards enterprise data.',
    heroBadge: 'Data Privacy & Ethics',
    primaryKeyword: 'Voice AI Data Privacy',
    secondaryKeywords: ['Customer Data Protection', 'Call Recording Privacy', 'PII Redaction AI', 'Telephony Data Ethics'],
    overview: [
      'As voice AI becomes central to customer communication, ethical data governance is paramount. AiBotCall operates with transparent data handling protocols.',
      'We treat all phone numbers, names, transcripts, and audio recordings as confidential enterprise assets. We never sell, monetize, or train shared public AI models on your proprietary business conversations.'
    ],
    keyCapabilities: [
      {
        title: 'Zero Public Model Training',
        desc: 'Your business call transcripts, customer records, and internal prompts are never used to train public foundational AI models.',
        iconName: 'Lock'
      },
      {
        title: 'Role-Based Workspace Permissions',
        desc: 'Granular access controls ensure only authorized team members can listen to recordings or export contact lists.',
        iconName: 'Users'
      },
      {
        title: 'Automated Data Retention Rules',
        desc: 'Configure custom retention periods for call audio and transcripts according to your corporate compliance policies.',
        iconName: 'Clock'
      },
      {
        title: 'Data Portability & Complete Deletion',
        desc: 'Export your complete call logs and contact records at any time, or request complete cryptographic data purging upon cancellation.',
        iconName: 'CheckCircle2'
      }
    ],
    geoAnswerBlock: {
      question: 'Does AiBotCall train public AI models on customer phone recordings?',
      answer: 'No. AiBotCall does not train public AI models on your private customer conversations, phone numbers, or transcripts. All data is isolated within your secure workspace and processed strictly to deliver your configured telephony services.'
    },
    faqs: [
      {
        q: 'Can we delete recordings after lead qualification is completed?',
        a: 'Yes. You can delete individual call recordings and transcripts or set automatic data purge policies from your workspace settings.'
      },
      {
        q: 'Who has access to the call recordings in our account?',
        a: 'Only authenticated users added to your team workspace with designated permissions can listen to or download call recordings.'
      }
    ],
    relatedSlugs: ['security', 'call-consent-policy', 'privacy-policy', 'terms']
  },

  // 19. Call Consent Policy
  'call-consent-policy': {
    slug: 'call-consent-policy',
    category: 'trust',
    categoryLabel: 'Enterprise Trust',
    metaTitle: 'Call Consent & Telephony Compliance Policy | AiBotCall',
    metaDescription: 'Guidelines for obtaining prior explicit customer consent, maintaining DND suppression, and ensuring responsible AI voice call automation in India.',
    h1: 'Call Consent & Responsible AI Telephony Policy',
    tagline: 'Best practices and legal requirements for obtaining explicit customer consent, managing opt-outs, and conducting ethical voice automation in India.',
    heroBadge: 'Ethical Telephony Guidelines',
    primaryKeyword: 'Call Consent Policy India',
    secondaryKeywords: ['Telephony Consent Guidelines', 'TRAI Calling Rules', 'DND Suppression Policy', 'Opt-In Voice Calling'],
    overview: [
      'AiBotCall is built exclusively for authorized business communication, inbound customer assistance, and speed-to-lead follow-up where customers have explicitly requested contact.',
      'Our platform strictly prohibits unsolicited spam, illegal telemarketing, predatory automated robocalls, and misleading caller ID spoofing. Users must maintain verifiable prior consent before initiating outbound campaigns.'
    ],
    keyCapabilities: [
      {
        title: 'Prior Explicit Consent Requirement',
        desc: 'Users must obtain valid opt-in consent (e.g. website form inquiry, webinar registration, or active customer relationship) before dialing.',
        iconName: 'CheckCircle2'
      },
      {
        title: 'Immediate Opt-Out Respect',
        desc: 'Every call agent must respect customer requests to cease contact, immediately triggering suppression registry addition.',
        iconName: 'ShieldCheck'
      },
      {
        title: 'Caller Identity Transparency',
        desc: 'The AI agent clearly introduces the business name in the opening statement, ensuring transparency with every recipient.',
        iconName: 'Award'
      },
      {
        title: 'Anti-Spam Monitoring & Account Suspension',
        desc: 'Accounts generating high abuse complaints, spam reports, or attempting unauthorized numbers face immediate suspension.',
        iconName: 'Lock'
      }
    ],
    geoAnswerBlock: {
      question: 'What are the consent requirements for automated AI calling in India?',
      answer: 'Businesses using AI voice calling in India must possess prior explicit consent (such as a website enquiry, service registration, or transactional relationship) before initiating outbound calls. Outbound calls must respect TRAI legal hours (9 AM to 8 PM), identify the calling entity clearly, and honor immediate opt-out requests.'
    },
    faqs: [
      {
        q: 'Can AiBotCall be used to purchase and cold call random phone numbers?',
        a: 'No. AiBotCall strictly enforces acceptable use policies prohibiting cold calling purchased spam lists. Outbound calling is reserved for opted-in leads and active customers.'
      },
      {
        q: 'How does the platform handle DND (Do Not Disturb) numbers?',
        a: 'Our telecom routing layer integrates DND suppression filters to scrub promotional campaigns against national registries automatically.'
      }
    ],
    relatedSlugs: ['security', 'data-privacy', 'terms', 'privacy-policy']
  }
};
