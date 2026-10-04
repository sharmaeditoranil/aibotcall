import { prisma } from '../db/prisma.js';
import { logger } from '../utils/logger.js';
import { z } from 'zod';

export interface ToolExecutionContext {
  callId: string;
  leadId?: string;
  agentId: string;
  organizationId: string;
  customerPhone: string;
  onEndCall?: (reason: string) => void;
  onDoNotCall?: (reason: string) => void;
}

export interface RealtimeToolDefinition {
  type: 'function';
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export const REALTIME_TOOLS_DEFINITIONS: RealtimeToolDefinition[] = [
  {
    type: 'function',
    name: 'get_lead_details',
    description: 'Fetches details of the customer/lead currently on call, such as name, city, course/service enquired, and custom variables.',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    type: 'function',
    name: 'get_business_information',
    description: 'Retrieves verified knowledge base details regarding courses, fees, batch timings, academy location, and policies. Never guess fee or policy data without querying this tool.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search topic or keyword, e.g. "Video Editing course fee", "batch timings", "offline branch location"',
        },
      },
      required: ['query'],
    },
  },
  {
    type: 'function',
    name: 'save_lead_field',
    description: 'Saves qualification data or details collected from the customer during the conversation.',
    parameters: {
      type: 'object',
      properties: {
        field_name: {
          type: 'string',
          enum: ['experience_level', 'mode_preference', 'joining_timeline', 'budget', 'city', 'course_interest'],
          description: 'The key attribute to record',
        },
        field_value: {
          type: 'string',
          description: 'The value stated by the customer',
        },
      },
      required: ['field_name', 'field_value'],
    },
  },
  {
    type: 'function',
    name: 'mark_lead_status',
    description: 'Classifies the call qualification status based on the customer response.',
    parameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: [
            'Qualified',
            'Interested',
            'Hot',
            'Warm',
            'Follow Up',
            'Callback Requested',
            'Not Interested',
            'Wrong Number',
          ],
          description: 'The CRM qualification stage',
        },
        reason: {
          type: 'string',
          description: 'Brief justification for this status',
        },
      },
      required: ['status'],
    },
  },
  {
    type: 'function',
    name: 'request_callback',
    description: 'Logs that the customer asked for a senior counselor or team member to call them back.',
    parameters: {
      type: 'object',
      properties: {
        preferred_time: {
          type: 'string',
          description: 'Preferred callback date or time window mentioned by customer, e.g. "Today 5 PM", "Tomorrow morning"',
        },
        note: {
          type: 'string',
          description: 'Topic or specific question customer wants to discuss with human counselor',
        },
      },
      required: ['note'],
    },
  },
  {
    type: 'function',
    name: 'save_customer_question',
    description: 'Saves any specific questions asked by the customer that need further attention by the sales team.',
    parameters: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          description: 'The question asked by customer',
        },
      },
      required: ['question'],
    },
  },
  {
    type: 'function',
    name: 'end_call',
    description: 'Politely concludes and ends the telephone call after delivering final greeting or when conversation is finished.',
    parameters: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          description: 'Reason for closing the call (e.g. "enquiry completed", "customer busy", "not interested")',
        },
      },
      required: ['reason'],
    },
  },
  {
    type: 'function',
    name: 'do_not_call',
    description: 'Immediately adds the customer to the suppression list and terminates call if customer expresses refusal or asks not to be called.',
    parameters: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          description: 'Exact refusal reason stated by the customer',
        },
      },
      required: ['reason'],
    },
  },
];

// Validation Schemas
const SaveFieldSchema = z.object({
  field_name: z.string().min(1).max(50),
  field_value: z.string().min(1).max(500),
});

const MarkStatusSchema = z.object({
  status: z.string().min(1),
  reason: z.string().optional(),
});

const RequestCallbackSchema = z.object({
  preferred_time: z.string().optional(),
  note: z.string().min(1),
});

/**
 * Executes a tool called by OpenAI Realtime model in a safe, sandboxed server environment.
 */
export async function executeRealtimeTool(
  name: string,
  rawArgs: string,
  ctx: ToolExecutionContext
): Promise<{ success: boolean; result: any }> {
  logger.info({ callId: ctx.callId, tool: name }, 'Executing realtime tool call');

  try {
    let args: any = {};
    if (rawArgs && rawArgs.trim() !== '') {
      args = JSON.parse(rawArgs);
    }

    switch (name) {
      case 'get_lead_details': {
        if (!ctx.leadId) {
          return {
            success: true,
            result: {
              phone: ctx.customerPhone,
              message: 'Lead record not attached, phone number available.',
            },
          };
        }
        const lead = await prisma.lead.findUnique({
          where: { id: ctx.leadId },
          select: {
            name: true,
            phone: true,
            email: true,
            city: true,
            service: true,
            source: true,
            message: true,
            custom_fields: true,
          },
        });
        return { success: true, result: lead || { phone: ctx.customerPhone } };
      }

      case 'get_business_information': {
        const query = typeof args.query === 'string' ? args.query.toLowerCase() : '';
        const items = await prisma.knowledgeBase.findMany({
          where: {
            organization_id: ctx.organizationId,
            is_active: true,
            OR: [{ agent_id: ctx.agentId }, { agent_id: null }],
          },
        });

        // Filter relevant knowledge items
        const matched = items.filter(
          (k) =>
            k.title.toLowerCase().includes(query) ||
            k.category.toLowerCase().includes(query) ||
            k.content.toLowerCase().includes(query)
        );

        const responseItems = (matched.length > 0 ? matched : items.slice(0, 5)).map((k) => ({
          title: k.title,
          category: k.category,
          content: k.content,
        }));

        return {
          success: true,
          result: {
            found: responseItems.length,
            knowledge: responseItems,
          },
        };
      }

      case 'save_lead_field': {
        const parsed = SaveFieldSchema.parse(args);
        await prisma.call.update({
          where: { internal_call_id: ctx.callId },
          data: {
            qualification_data: {
              ...(await getExistingQualificationData(ctx.callId)),
              [parsed.field_name]: parsed.field_value,
            },
          },
        });

        if (ctx.leadId) {
          const lead = await prisma.lead.findUnique({ where: { id: ctx.leadId } });
          const existingFields = (lead?.custom_fields as Record<string, any>) || {};
          await prisma.lead.update({
            where: { id: ctx.leadId },
            data: {
              custom_fields: { ...existingFields, [parsed.field_name]: parsed.field_value },
            },
          });
        }

        return { success: true, result: { saved: true, field: parsed.field_name } };
      }

      case 'mark_lead_status': {
        const parsed = MarkStatusSchema.parse(args);
        await prisma.call.update({
          where: { internal_call_id: ctx.callId },
          data: {
            qualification_status: parsed.status,
          },
        });

        return { success: true, result: { status: parsed.status, updated: true } };
      }

      case 'request_callback': {
        const parsed = RequestCallbackSchema.parse(args);
        await prisma.call.update({
          where: { internal_call_id: ctx.callId },
          data: {
            callback_requested: true,
            callback_preferred_time: parsed.preferred_time || null,
            callback_note: parsed.note,
            next_action: 'Human callback',
          },
        });

        return { success: true, result: { callback_scheduled: true } };
      }

      case 'save_customer_question': {
        const question = String(args.question || '');
        const call = await prisma.call.findUnique({ where: { internal_call_id: ctx.callId } });
        const existingPoints = (call?.important_points as string[]) || [];

        await prisma.call.update({
          where: { internal_call_id: ctx.callId },
          data: {
            important_points: [...existingPoints, `Customer Question: ${question}`],
          },
        });

        return { success: true, result: { recorded: true } };
      }

      case 'end_call': {
        const reason = String(args.reason || 'completed');
        if (ctx.onEndCall) {
          ctx.onEndCall(reason);
        }
        return { success: true, result: { call_ending: true, reason } };
      }

      case 'do_not_call': {
        const reason = String(args.reason || 'Customer requested opt-out');
        // Add to suppression list
        await prisma.suppressionList.upsert({
          where: {
            organization_id_phone: {
              organization_id: ctx.organizationId,
              phone: ctx.customerPhone,
            },
          },
          update: { reason, source: 'ai_voice_call' },
          create: {
            organization_id: ctx.organizationId,
            phone: ctx.customerPhone,
            reason,
            source: 'ai_voice_call',
            call_id: ctx.callId,
          },
        });

        await prisma.call.update({
          where: { internal_call_id: ctx.callId },
          data: {
            qualification_status: 'Do Not Call',
            next_action: 'None (Opted out)',
          },
        });

        if (ctx.onDoNotCall) {
          ctx.onDoNotCall(reason);
        }

        return { success: true, result: { suppressed: true, number: ctx.customerPhone } };
      }

      default:
        return { success: false, result: `Tool ${name} is not recognized` };
    }
  } catch (err: any) {
    logger.error({ callId: ctx.callId, tool: name, error: err.message }, 'Tool execution error');
    return { success: false, result: `Error executing tool: ${err.message}` };
  }
}

async function getExistingQualificationData(callId: string): Promise<Record<string, any>> {
  const call = await prisma.call.findUnique({
    where: { internal_call_id: callId },
    select: { qualification_data: true },
  });
  return (call?.qualification_data as Record<string, any>) || {};
}
