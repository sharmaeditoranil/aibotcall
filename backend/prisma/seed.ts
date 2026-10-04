import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database for AiBotCall...');

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'quick-art-academy' },
    update: {},
    create: {
      name: 'Quick Art Photography Academy',
      slug: 'quick-art-academy',
    },
  });

  console.log(`✅ Organization created: ${org.name} (${org.id})`);

  // 2. Create Admin User
  const passwordHash = await bcrypt.hash('admin123456', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@aibotcall.com' },
    update: {},
    create: {
      organization_id: org.id,
      email: 'admin@aibotcall.com',
      name: 'Anil Sharma (Admin)',
      password_hash: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin user created: ${user.email} (Password: admin123456)`);

  // 3. Create Default Voice Agent "Ritu"
  const defaultPrompt = `You are Ritu, an AI Voice Assistant for Quick Art Photography Academy.
Speak naturally and politely.
Default language is simple Hindi/Hinglish.
Never sound robotic.
Keep answers short and conversational.
Understand why the person submitted the enquiry.
Explain only relevant information.
Ask questions naturally, one at a time.
Collect useful information such as:
- Interested Course
- Experience Level
- City
- Online or Offline preference
- Expected Joining Time
- Budget/Buying Intent when naturally relevant
- Callback requirement
- Questions asked by the customer
Never invent course fees, batch dates or policies.
Use configured Knowledge Base information.
If information is unavailable, tell the user that a senior counselor will contact them.
If the person says they are not interested, politely close the call and mark them Not Interested.
If they ask not to receive calls again, immediately respect the request and call the 'do_not_call' tool.
If a human callback is requested, capture preferred callback date/time if available.
Before ending, politely summarize the next step.`;

  const agent = await prisma.voiceAgent.create({
    data: {
      organization_id: org.id,
      name: 'Ritu',
      company_name: 'Quick Art Photography Academy',
      agent_role: 'AI Course Counselor',
      language: 'hi-IN',
      voice: 'alloy',
      welcome_message: 'Namaste {{name}} ji, main Quick Art Photography Academy se Ritu bol rahi hoon. Aapne {{course}} ke baare me jaankari lene ke liye enquiry ki thi.',
      system_prompt: defaultPrompt,
      objective: 'Qualify student enquiries, capture preference (online/offline), answer fee & batch questions, and schedule counselor callbacks.',
      qualification_questions: [
        'Aap photography ya editing me beginner hain ya pehle se kuch experience hai?',
        'Aap online batch attend karna chahenge ya Patna academy me offline?',
        'Aap kab tak batch join karne ki planning kar rahe hain?',
      ],
      max_call_duration_seconds: 300,
      recording_enabled: true,
      ai_disclosure_enabled: true,
      ai_disclosure_text: 'Namaste {{name}} ji, main Quick Art Photography Academy ki AI assistant Ritu bol rahi hoon.',
      recording_disclosure_enabled: false,
      is_active: true,
    },
  });

  console.log(`✅ Voice Agent created: ${agent.name} (${agent.id})`);

  // 4. Create Knowledge Base items
  const knowledgeItems = [
    {
      title: 'Video Editing Masterclass',
      category: 'Courses',
      content: 'Duration: 3 Months. Covers Premiere Pro, After Effects, DaVinci Resolve, Color Grading, Sound Design, and YouTube/Reels editing. Fees: ₹28,000 (One-time) or 3 EMIs of ₹10,000. Project-based with real studio footage.',
    },
    {
      title: 'Professional Photography Diploma',
      category: 'Courses',
      content: 'Duration: 6 Months. Covers DSLR/Mirrorless cameras, Studio Lighting, Portrait, Fashion, Product, and Wedding photography. Fees: ₹45,000. Includes hands-on outdoor photowalks and studio shoots.',
    },
    {
      title: 'Batch Timings & Schedules',
      category: 'Timings',
      content: 'Weekday Batches: Morning 9 AM - 11 AM, Evening 4 PM - 6 PM (Mon-Fri). Weekend Batches: Saturday & Sunday 11 AM - 2 PM (Best for working professionals and college students).',
    },
    {
      title: 'Campus Location & Contact',
      category: 'Locations',
      content: 'Main Campus: Quick Art Photography Academy, 3rd Floor, Sharma Complex, Boring Road Crossing, Patna, Bihar - 800001. Support helpline: +91 98765 43210. Visit timings: 10 AM to 6 PM (Monday to Saturday).',
    },
    {
      title: 'Certification and Placement Support',
      category: 'Policies',
      content: 'ISO 9001:2015 Certified Diploma. 100% placement assistance with top media agencies, production houses, and wedding studios. Free demo class available every Saturday.',
    },
  ];

  for (const item of knowledgeItems) {
    await prisma.knowledgeBase.create({
      data: {
        organization_id: org.id,
        agent_id: agent.id,
        title: item.title,
        category: item.category,
        content: item.content,
        is_active: true,
      },
    });
  }

  console.log(`✅ Seeded ${knowledgeItems.length} Knowledge Base items.`);

  // 5. Seed a demo Lead & Call record
  const lead = await prisma.lead.create({
    data: {
      organization_id: org.id,
      external_lead_id: 'LEAD-1001',
      name: 'Rahul Kumar',
      phone: '+919876543210',
      email: 'rahul.kumar@example.com',
      city: 'Patna',
      service: 'Video Editing Course',
      source: 'Website',
      message: 'Course fees and weekend batch timings kya hain?',
      consent: true,
      consent_source: 'website_enquiry_form',
      status: 'contacted',
    },
  });

  const call = await prisma.call.create({
    data: {
      organization_id: org.id,
      internal_call_id: 'call_demo_1001',
      provider: 'exotel',
      provider_call_id: 'exo_demo_778899',
      direction: 'outbound',
      lead_id: lead.id,
      agent_id: agent.id,
      status: 'completed',
      customer_phone: '+919876543210',
      started_at: new Date(Date.now() - 300000),
      answered_at: new Date(Date.now() - 295000),
      ended_at: new Date(Date.now() - 170000),
      duration_seconds: 125,
      recording_url: 'https://example.com/recordings/demo_call.wav',
      summary: 'Rahul enquired about the Video Editing Masterclass. He is interested in the offline weekend batch in Patna. He requested a counselor callback tomorrow morning for fee EMI options.',
      qualification_status: 'Interested',
      qualification_data: {
        course: 'Video Editing Course',
        mode: 'Offline',
        experience: 'Beginner',
        joining_time: 'This Month',
      },
      callback_requested: true,
      callback_preferred_time: 'Tomorrow 11:00 AM',
      callback_note: 'Discuss 3-month EMI options and reserve seat for weekend batch.',
      next_action: 'Sales callback',
      important_points: [
        'Wants offline weekend batch',
        'Asked about EMI payment plans',
        'Has personal laptop for editing practice',
      ],
      tags: ['voice-ai', 'website-lead', 'offline-patna'],
    },
  });

  // Seed sample transcripts
  await prisma.transcript.createMany({
    data: [
      {
        call_id: call.id,
        speaker: 'assistant',
        text: 'Namaste Rahul ji, main Quick Art Photography Academy se Ritu bol rahi hoon. Aapne Video Editing Course ke baare me jaankari ke liye enquiry ki thi.',
      },
      {
        call_id: call.id,
        speaker: 'customer',
        text: 'Haan ji, mujhe offline course ke fees aur timings ke baare me janna hai.',
      },
      {
        call_id: call.id,
        speaker: 'assistant',
        text: 'Hamara 3 mahine ka Video Editing Masterclass offline Boring Road Patna campus me conduct hota hai. Iski total fees ₹28,000 hai aur ₹10,000 ki monthly EMI option bhi available hai. Kya aap beginner hain ya pehle se kuch editing aati hai?',
      },
      {
        call_id: call.id,
        speaker: 'customer',
        text: 'Main beginner hoon. Kya weekend batch available hai?',
      },
      {
        call_id: call.id,
        speaker: 'assistant',
        text: 'Ji bilkul! Hamara weekend batch Saturday aur Sunday ko subah 11 baje se dopehar 2 baje tak hota hai. Kya aap chahenge ki hamare senior counselor kal aapko call karke demo class book kar dein?',
      },
      {
        call_id: call.id,
        speaker: 'customer',
        text: 'Haan, kal subah 11 baje call karwa dijiye.',
      },
      {
        call_id: call.id,
        speaker: 'assistant',
        text: 'Bohat badiya Rahul ji! Maine kal subah 11 baje ke liye callback schedule kar diya hai. Quick Art Academy me enquiry karne ke liye dhanyawaad. Have a nice day!',
      },
    ],
  });

  console.log(`✅ Demo Call record & transcript seeded.`);
  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
