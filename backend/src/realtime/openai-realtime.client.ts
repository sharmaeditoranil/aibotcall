import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { REALTIME_TOOLS_DEFINITIONS, executeRealtimeTool, ToolExecutionContext } from './tools-registry.js';

export interface OpenAIRealtimeSessionOptions {
  model?: string;
  voice?: string;
  instructions: string;
  welcomeMessage?: string;
  audioFormat?: 'g711_ulaw' | 'pcm16';
  context: ToolExecutionContext;
}

export class OpenAIRealtimeClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private options: OpenAIRealtimeSessionOptions;
  private currentResponseId: string | null = null;
  private isAssistantSpeaking = false;

  constructor(options: OpenAIRealtimeSessionOptions) {
    super();
    this.options = options;
  }

  /**
   * Connects to the OpenAI Realtime WebSocket server.
   */
  async connect(): Promise<void> {
    const model = this.options.model || config.openai.realtimeModel || 'gpt-4o-realtime-preview';
    const url = `${config.openai.realtimeWsUrl}?model=${encodeURIComponent(model)}`;

    logger.info(
      { callId: this.options.context.callId, model },
      'Connecting to OpenAI Realtime Voice API'
    );

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url, {
        headers: {
          Authorization: `Bearer ${config.openai.apiKey}`,
          'OpenAI-Beta': 'realtime=v1',
        },
      });

      this.ws.on('open', () => {
        this.isConnected = true;
        logger.info({ callId: this.options.context.callId }, 'Connected to OpenAI Realtime WebSocket');
        this.initSession();
        resolve();
      });

      this.ws.on('message', (data: WebSocket.Data) => {
        try {
          const event = JSON.parse(data.toString());
          this.handleServerEvent(event);
        } catch (err: any) {
          logger.error({ callId: this.options.context.callId, err: err.message }, 'Failed to parse OpenAI event');
        }
      });

      this.ws.on('error', (err) => {
        logger.error({ callId: this.options.context.callId, err: err.message }, 'OpenAI WebSocket error');
        this.emit('error', err);
        if (!this.isConnected) reject(err);
      });

      this.ws.on('close', (code, reason) => {
        this.isConnected = false;
        logger.info(
          { callId: this.options.context.callId, code, reason: reason.toString() },
          'OpenAI Realtime WebSocket closed'
        );
        this.emit('close', { code, reason: reason.toString() });
      });
    });
  }

  /**
   * Configures the active session with system prompt, voice, server VAD, and tools.
   */
  private initSession(): void {
    const audioFormat = this.options.audioFormat || 'g711_ulaw';
    const voice = this.options.voice || 'alloy';

    const sessionUpdate = {
      type: 'session.update',
      session: {
        modalities: ['audio', 'text'],
        instructions: this.options.instructions,
        voice,
        input_audio_format: audioFormat,
        output_audio_format: audioFormat,
        input_audio_transcription: {
          model: 'whisper-1',
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.60, // Optimal for telephony noise suppression in Indian mobile networks
          prefix_padding_ms: 300, // Pre-buffers speech to prevent clipping first syllables
          silence_duration_ms: 450, // Optimal conversational pause before AI response
        },
        tools: REALTIME_TOOLS_DEFINITIONS,
        tool_choice: 'auto',
        temperature: 0.65, // Crisper, natural speech without hallucination
      },
    };

    this.send(sessionUpdate);

    // If a welcome message is configured, instruct the assistant to speak it
    if (this.options.welcomeMessage) {
      setTimeout(() => {
        this.triggerInitialGreeting(this.options.welcomeMessage!);
      }, 400);
    }
  }

  /**
   * Triggers the assistant greeting message.
   */
  triggerInitialGreeting(text: string): void {
    this.send({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: `[SYSTEM: Call answered. Greet customer immediately with this welcome message naturally: "${text}"]`,
          },
        ],
      },
    });

    this.send({
      type: 'response.create',
    });
  }

  /**
   * Appends incoming caller audio buffer to the OpenAI Realtime input buffer.
   */
  appendAudio(base64Chunk: string): void {
    if (!this.isConnected || !this.ws) return;
    this.send({
      type: 'input_audio_buffer.append',
      audio: base64Chunk,
    });
  }

  /**
   * Handles incoming server events from OpenAI Realtime API.
   */
  private async handleServerEvent(event: any): Promise<void> {
    const callId = this.options.context.callId;

    switch (event.type) {
      case 'session.created':
      case 'session.updated':
        logger.debug({ callId, type: event.type }, 'OpenAI Realtime session ready');
        this.emit('session_ready', event);
        break;

      // Customer started speaking - BARGE-IN TRIGGER
      case 'input_audio_buffer.speech_started': {
        logger.info({ callId }, 'Customer speech started (barge-in detected)');
        if (this.isAssistantSpeaking) {
          this.cancelAssistantSpeech();
        }
        this.emit('barge_in');
        break;
      }

      case 'input_audio_buffer.speech_stopped':
        logger.debug({ callId }, 'Customer speech stopped');
        break;

      // Customer transcript from whisper
      case 'conversation.item.input_audio_transcription.completed': {
        const transcript = event.transcript?.trim();
        if (transcript) {
          logger.info({ callId, speaker: 'customer', text: transcript }, 'Customer transcript');
          this.emit('transcript', { speaker: 'customer', text: transcript });
        }
        break;
      }

      // Assistant starts generating a response
      case 'response.created':
        this.currentResponseId = event.response?.id || null;
        this.isAssistantSpeaking = true;
        break;

      // Assistant audio delta to forward to telephony
      case 'response.audio.delta': {
        const base64Audio = event.delta;
        if (base64Audio) {
          this.emit('audio_delta', base64Audio);
        }
        break;
      }

      // Assistant text transcript delta
      case 'response.audio_transcript.done': {
        const text = event.transcript?.trim();
        if (text) {
          logger.info({ callId, speaker: 'assistant', text }, 'Assistant transcript');
          this.emit('transcript', { speaker: 'assistant', text });
        }
        break;
      }

      case 'response.done':
        this.isAssistantSpeaking = false;
        this.currentResponseId = null;
        break;

      // Function/Tool Calling
      case 'response.function_call_arguments.done': {
        const toolName = event.name;
        const callArgs = event.arguments;
        const toolCallId = event.call_id;

        logger.info({ callId, tool: toolName, toolCallId }, 'OpenAI tool call requested');

        const { result } = await executeRealtimeTool(toolName, callArgs, this.options.context);

        // Submit tool output back to OpenAI
        this.send({
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id: toolCallId,
            output: JSON.stringify(result),
          },
        });

        // Trigger assistant to continue speaking with tool result
        this.send({
          type: 'response.create',
        });
        break;
      }

      case 'error':
        logger.error({ callId, error: event.error }, 'OpenAI Realtime returned error');
        this.emit('error', event.error);
        break;

      default:
        break;
    }
  }

  /**
   * Interrupts and halts assistant speech in realtime.
   */
  cancelAssistantSpeech(): void {
    if (this.currentResponseId && this.isConnected) {
      logger.info({ callId: this.options.context.callId }, 'Cancelling assistant response due to user interruption');
      this.send({
        type: 'response.cancel',
      });
    }
    this.isAssistantSpeaking = false;
  }

  send(payload: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  disconnect(): void {
    if (this.ws) {
      try {
        this.ws.removeAllListeners();
        this.ws.close();
      } catch {
        // Ignore close errors
      }
      this.ws = null;
      this.isConnected = false;
    }
  }
}
