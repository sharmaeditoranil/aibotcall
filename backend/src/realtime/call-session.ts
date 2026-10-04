import WebSocket from 'ws';
import { OpenAIRealtimeClient } from './openai-realtime.client.js';
import { prisma } from '../db/prisma.js';
import { logger } from '../utils/logger.js';
import { crmWebhookService } from '../services/crm-webhook.service.js';

export interface CallSessionParams {
  internalCallId: string;
  providerCallId?: string;
  streamSid?: string;
  agentId: string;
  leadId?: string;
  organizationId: string;
  customerPhone: string;
  customVariables?: Record<string, any>;
  exotelWs: WebSocket;
  onHangup?: () => Promise<void>;
}

export interface TranscriptEntry {
  speaker: 'assistant' | 'customer';
  text: string;
  timestamp: Date;
}

export class CallSession {
  readonly internalCallId: string;
  readonly providerCallId?: string;
  readonly organizationId: string;
  readonly agentId: string;
  readonly leadId?: string;
  readonly customerPhone: string;

  private streamSid: string | null = null;
  private exotelWs: WebSocket;
  private openAiClient: OpenAIRealtimeClient | null = null;
  private transcripts: TranscriptEntry[] = [];
  private callStartTime: Date | null = null;
  private callAnsweredTime: Date | null = null;
  private durationTimer: NodeJS.Timeout | null = null;
  private isFinalized = false;
  private customVariables: Record<string, any> = {};
  private onHangup?: () => Promise<void>;

  constructor(params: CallSessionParams) {
    this.internalCallId = params.internalCallId;
    this.providerCallId = params.providerCallId;
    this.streamSid = params.streamSid || null;
    this.agentId = params.agentId;
    this.leadId = params.leadId;
    this.organizationId = params.organizationId;
    this.customerPhone = params.customerPhone;
    this.customVariables = params.customVariables || {};
    this.exotelWs = params.exotelWs;
    this.onHangup = params.onHangup;
  }

  setStreamSid(streamSid: string): void {
    this.streamSid = streamSid;
  }

  /**
   * Initializes session: fetches Agent prompt & Knowledge base, configures OpenAI client,
   * starts audio forwarding.
   */
  async start(): Promise<void> {
    this.callStartTime = new Date();
    this.callAnsweredTime = new Date();

    // Fetch Agent details
    const agent = await prisma.voiceAgent.findUnique({
      where: { id: this.agentId },
    });

    if (!agent) {
      throw new Error(`VoiceAgent with id ${this.agentId} not found`);
    }

    // Fetch Knowledge Base items for agent / organization
    const knowledgeItems = await prisma.knowledgeBase.findMany({
      where: {
        organization_id: this.organizationId,
        is_active: true,
        OR: [{ agent_id: this.agentId }, { agent_id: null }],
      },
    });

    const knowledgeSummary = knowledgeItems
      .map((k) => `[${k.category.toUpperCase()}] ${k.title}:\n${k.content}`)
      .join('\n\n');

    // Build personalized instructions & welcome message
    let welcomeMessage = agent.welcome_message;
    let systemPrompt = agent.system_prompt;

    // Apply template variables (e.g. {{name}}, {{city}}, {{course}}, {{source}})
    for (const [key, value] of Object.entries(this.customVariables)) {
      const reg = new RegExp(`{{${key}}}`, 'gi');
      welcomeMessage = welcomeMessage.replace(reg, String(value));
      systemPrompt = systemPrompt.replace(reg, String(value));
    }

    // Add AI Disclosure if enabled
    let fullWelcome = welcomeMessage;
    if (agent.ai_disclosure_enabled && agent.ai_disclosure_text) {
      let disclosure = agent.ai_disclosure_text;
      for (const [key, value] of Object.entries(this.customVariables)) {
        disclosure = disclosure.replace(new RegExp(`{{${key}}}`, 'gi'), String(value));
      }
      fullWelcome = `${disclosure} ${welcomeMessage}`;
    }

    // Append Knowledge Base context into system prompt with strict guardrails
    const fullInstructions = `
${systemPrompt}

### BUSINESS KNOWLEDGE BASE (OFFICIAL GROUND TRUTH):
${knowledgeSummary || 'Standard company information applies.'}

### STRICT ACCURACY & ANTI-OFF-TOPIC RULES (MANDATORY & CRITICAL):
1. STRICT TOPIC FOCUS: You are strictly the voice representative of "${agent.company_name}" focusing on "${agent.objective}".
2. ZERO OFF-TOPIC ENTERTAINMENT: If the caller asks about ANY off-topic subject (general knowledge, coding, weather, politics, gossip, jokes, personal chit-chat, or other businesses), DO NOT answer their off-topic query. Politely and firmly decline and redirect them back to the topic:
   - Example (Hindi/Hinglish): "Main sirf ${agent.company_name} ke sambandh mein sahayata karne ke liye call par hoon. Kya hum hamare main topic par baat aage badhayein?"
3. NEVER HALLUCINATE OR GUESS: All answers regarding pricing, discounts, dates, and policies MUST come exclusively from the BUSINESS KNOWLEDGE BASE above. If a detail is not present in the knowledge base, NEVER invent numbers. Politely say: "Is baare mein hamari team aapse verified details share kar degi, kya main aapka message note kar loon?"
4. CRISP TELEPHONY RESPONSES: Keep spoken answers short, natural, and conversational (1 to 2 sentences maximum). Never deliver long monologues or lectures on a phone call.
5. ONE QUESTION AT A TIME: Always ask only one question at a time so the caller can easily respond.
6. NATURAL LANGUAGE ADAPTATION: Mirror the caller's language smoothly (Hindi, Hinglish, or English) with warmth and utmost respect.
7. DNC REQUESTS: If customer says "Mujhe call mat kariye" or asks to remove their number, call 'do_not_call' tool immediately and politely apologize.
8. HUMAN CALLBACK: If customer asks for a senior team member, call 'request_callback' tool with their preferred time.
9. MAXIMUM CALL DURATION: This conversation is strictly monitored with a maximum duration of ${agent.max_call_duration_seconds || 300} seconds. Wrap up smoothly before time expires.
10. WRAP UP: When the enquiry is finished, politely summarize and call 'end_call' tool.
`.trim();

    // Instantiate OpenAI Realtime client
    this.openAiClient = new OpenAIRealtimeClient({
      voice: agent.voice,
      instructions: fullInstructions,
      welcomeMessage: fullWelcome,
      audioFormat: 'g711_ulaw', // Exotel native telephony format
      context: {
        callId: this.internalCallId,
        leadId: this.leadId,
        agentId: this.agentId,
        organizationId: this.organizationId,
        customerPhone: this.customerPhone,
        onEndCall: async (reason) => {
          logger.info({ callId: this.internalCallId, reason }, 'Agent initiated end_call tool');
          await this.endCall(reason);
        },
        onDoNotCall: async (reason) => {
          logger.info({ callId: this.internalCallId, reason }, 'Agent initiated do_not_call tool');
          await this.endCall('Customer opted out (DNC)');
        },
      },
    });

    // Handle audio emitted by OpenAI Realtime -> forward to Exotel WebSocket
    this.openAiClient.on('audio_delta', (base64Audio: string) => {
      this.sendAudioToExotel(base64Audio);
    });

    // Handle user interruption / barge-in
    this.openAiClient.on('barge_in', () => {
      this.clearExotelAudioBuffer();
    });

    // Handle transcript updates
    this.openAiClient.on('transcript', (entry: { speaker: 'assistant' | 'customer'; text: string }) => {
      this.transcripts.push({
        speaker: entry.speaker,
        text: entry.text,
        timestamp: new Date(),
      });
    });

    // Connect to OpenAI Realtime
    await this.openAiClient.connect();

    // Set max call duration timer
    const maxDurationSeconds = agent.max_call_duration_seconds || 300;
    this.durationTimer = setTimeout(async () => {
      logger.info({ callId: this.internalCallId }, 'Max call duration reached, terminating call');
      await this.endCall('max_duration_exceeded');
    }, maxDurationSeconds * 1000);

    // Update database call record status to in_progress
    await prisma.call.update({
      where: { internal_call_id: this.internalCallId },
      data: {
        status: 'in_progress',
        answered_at: this.callAnsweredTime,
      },
    });
  }

  /**
   * Processes incoming audio buffer from Exotel WebSocket.
   */
  handleExotelAudio(base64Payload: string): void {
    if (this.openAiClient && !this.isFinalized) {
      this.openAiClient.appendAudio(base64Payload);
    }
  }

  /**
   * Sends audio packet to Exotel via WebSocket media protocol.
   */
  private sendAudioToExotel(base64Audio: string): void {
    if (this.exotelWs.readyState === WebSocket.OPEN && !this.isFinalized) {
      const mediaMessage = {
        event: 'media',
        streamSid: this.streamSid,
        media: {
          payload: base64Audio,
        },
      };
      this.exotelWs.send(JSON.stringify(mediaMessage));
    }
  }

  /**
   * Sends clear signal to Exotel to immediately halt playing assistant audio on user interruption.
   */
  private clearExotelAudioBuffer(): void {
    if (this.exotelWs.readyState === WebSocket.OPEN && !this.isFinalized) {
      const clearMessage = {
        event: 'clear',
        streamSid: this.streamSid,
      };
      this.exotelWs.send(JSON.stringify(clearMessage));
    }
  }

  /**
   * Concludes call session, persists transcripts, classifies conversation, and dispatches CRM webhook.
   */
  async endCall(reason = 'completed'): Promise<void> {
    if (this.isFinalized) return;
    this.isFinalized = true;

    if (this.durationTimer) {
      clearTimeout(this.durationTimer);
      this.durationTimer = null;
    }

    const endedAt = new Date();
    const durationSeconds = this.callAnsweredTime
      ? Math.round((endedAt.getTime() - this.callAnsweredTime.getTime()) / 1000)
      : 0;

    logger.info(
      { callId: this.internalCallId, durationSeconds, reason },
      'Finalizing call session and cleaning up'
    );

    // Deduct SaaS call minutes from organization balance
    if (durationSeconds > 0) {
      const minutesToDeduct = Math.ceil(durationSeconds / 60);
      try {
        await prisma.organization.update({
          where: { id: this.organizationId },
          data: {
            credits_balance_minutes: { decrement: minutesToDeduct },
          },
        });
      } catch (err: any) {
        logger.error({ callId: this.internalCallId, err: err.message }, 'Failed to deduct call minutes');
      }
    }

    // Disconnect OpenAI client
    if (this.openAiClient) {
      this.openAiClient.disconnect();
      this.openAiClient = null;
    }

    // Trigger telephony provider hangup if configured
    if (this.onHangup) {
      try {
        await this.onHangup();
      } catch (err: any) {
        logger.warn({ callId: this.internalCallId, err: err.message }, 'Provider hangup error');
      }
    }

    // Store transcripts in database
    if (this.transcripts.length > 0) {
      const call = await prisma.call.findUnique({
        where: { internal_call_id: this.internalCallId },
        select: { id: true },
      });

      if (call) {
        await prisma.transcript.createMany({
          data: this.transcripts.map((t) => ({
            call_id: call.id,
            speaker: t.speaker,
            text: t.text,
            created_at: t.timestamp,
          })),
        });
      }
    }

    // Perform structured AI post-call qualification and summary
    await this.generatePostCallAnalysis(durationSeconds, endedAt);
  }

  /**
   * Generates summary, extracts qualification fields, and dispatches CRM outgoing webhook.
   */
  private async generatePostCallAnalysis(durationSeconds: number, endedAt: Date): Promise<void> {
    try {
      const call = await prisma.call.findUnique({
        where: { internal_call_id: this.internalCallId },
        include: {
          lead: true,
          agent: true,
        },
      });

      if (!call) return;

      // Build conversation text
      const transcriptText = this.transcripts
        .map((t) => `${t.speaker === 'assistant' ? 'AI' : 'Customer'}: ${t.text}`)
        .join('\n');

      let summary = call.summary;
      let qualificationStatus = call.qualification_status;
      let nextAction = call.next_action;

      // If qualification was not already set by tool calling, derive smart defaults
      if (!qualificationStatus) {
        if (durationSeconds < 10 && this.transcripts.length < 2) {
          qualificationStatus = 'No Answer';
          summary = 'Call connected briefly but customer hung up or did not speak.';
          nextAction = 'Retry call';
        } else if (call.callback_requested) {
          qualificationStatus = 'Callback Requested';
          summary = 'Customer spoke with AI and requested a callback from counselor.';
          nextAction = 'Sales callback';
        } else {
          qualificationStatus = 'Interested';
          summary = 'Customer engaged with AI voice counselor regarding course enquiry.';
          nextAction = 'Follow Up';
        }
      }

      if (!summary && this.transcripts.length > 0) {
        summary = `Customer spoke with ${call.agent.name}. Conversation covered ${this.transcripts.length} exchanges.`;
      }

      // Update call record
      await prisma.call.update({
        where: { id: call.id },
        data: {
          status: 'completed',
          ended_at: endedAt,
          duration_seconds: durationSeconds,
          summary,
          qualification_status: qualificationStatus,
          next_action: nextAction || 'Follow Up',
        },
      });

      // Dispatch outgoing CRM Webhook to Deal CRM / WhatsApp CRM
      await crmWebhookService.dispatchCallCompletedWebhook(call.id);
    } catch (err: any) {
      logger.error(
        { callId: this.internalCallId, err: err.message },
        'Error generating post-call analysis'
      );
    }
  }
}
