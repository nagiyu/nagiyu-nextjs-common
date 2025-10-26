import { NextRequest } from 'next/server';

import { SubscriptionDataType } from '@common/interfaces/data/SubscriptionDataType';
import { SubscriptionService } from '@common/services/subscription/SubscriptionService';
import { BadRequestError } from '@common/errors';

export class SubscriptionAPIHelper {
  public static async get(request: NextRequest): Promise<SubscriptionDataType> {
    const { searchParams } = new URL(request.url);
    const terminalId = searchParams.get('terminalId') || '';

    if (!terminalId) {
      throw new BadRequestError('terminalId is required');
    }

    const service = new SubscriptionService();
    return service.getByTerminalId(terminalId);
  }

  public static async post(request: NextRequest): Promise<SubscriptionDataType> {
    const body: Partial<SubscriptionDataType> = await request.json();

    if (!body) {
      throw new BadRequestError('Request body is required');
    }

    if (!body.terminalId) {
      throw new BadRequestError('terminalId is required in the request body');
    }

    if (!body.subscription) {
      throw new BadRequestError('subscription is required in the request body');
    }

    const service = new SubscriptionService();
    return service.create(body);
  }

  public static async put(request: NextRequest): Promise<SubscriptionDataType> {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    const body: Partial<SubscriptionDataType> = await request.json();

    if (!id) {
      throw new BadRequestError('id is required');
    }

    if (!body) {
      throw new BadRequestError('Request body is required');
    }

    if (!body.terminalId) {
      throw new BadRequestError('terminalId is required in the request body');
    }

    if (!body.subscription) {
      throw new BadRequestError('subscription is required in the request body');
    }

    const service = new SubscriptionService();
    return service.update(id, body);
  }

  public static async delete(request: NextRequest): Promise<void> {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';

    if (!id) {
      throw new BadRequestError('id is required');
    }

    const service = new SubscriptionService();
    return service.delete(id);
  }
}
