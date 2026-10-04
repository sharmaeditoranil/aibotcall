import { prisma } from '../db/prisma.js';
import { normalizePhoneNumber } from '../utils/phone.js';
import { logger } from '../utils/logger.js';

export class SuppressionService {
  /**
   * Checks if a phone number is on the suppression / DNC list for an organization.
   */
  async isSuppressed(organizationId: string, rawPhone: string): Promise<boolean> {
    const { e164 } = normalizePhoneNumber(rawPhone);
    const phoneToCheck = e164 || rawPhone;

    const entry = await prisma.suppressionList.findFirst({
      where: {
        organization_id: organizationId,
        phone: phoneToCheck,
      },
    });

    return !!entry;
  }

  /**
   * Adds a phone number to the suppression list.
   */
  async addSuppression(
    organizationId: string,
    rawPhone: string,
    reason = 'Customer requested Do Not Call',
    source = 'manual_admin',
    callId?: string
  ): Promise<boolean> {
    const { e164, isValid } = normalizePhoneNumber(rawPhone);
    const phone = isValid ? e164 : rawPhone;

    try {
      await prisma.suppressionList.upsert({
        where: {
          organization_id_phone: {
            organization_id: organizationId,
            phone,
          },
        },
        update: {
          reason,
          source,
          call_id: callId || undefined,
        },
        create: {
          organization_id: organizationId,
          phone,
          reason,
          source,
          call_id: callId || undefined,
        },
      });

      logger.info({ organizationId, phone, reason }, 'Number added to suppression list');
      return true;
    } catch (err: any) {
      logger.error({ organizationId, phone, err: err.message }, 'Failed to add to suppression list');
      return false;
    }
  }

  /**
   * Removes a phone number from the suppression list.
   */
  async removeSuppression(organizationId: string, id: string): Promise<boolean> {
    try {
      await prisma.suppressionList.deleteMany({
        where: {
          id,
          organization_id: organizationId,
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Lists suppression entries.
   */
  async listSuppression(organizationId: string, query?: string, skip = 0, take = 50) {
    const whereClause: any = { organization_id: organizationId };
    if (query) {
      whereClause.phone = { contains: query };
    }

    const [items, total] = await Promise.all([
      prisma.suppressionList.findMany({
        where: whereClause,
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      prisma.suppressionList.count({ where: whereClause }),
    ]);

    return { items, total };
  }
}

export const suppressionService = new SuppressionService();
