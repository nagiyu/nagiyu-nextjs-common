import { NextResponse } from 'next/server';
import webpush from 'web-push';

import SecretsManagerUtil from '@common/aws/SecretsManagerUtil';
import { BadRequestError } from '@common/errors';

export interface PayloadType {
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, any>;
}

export default class NotificationUtil {
  public static async sendNotification(subscription: any, payload: PayloadType): Promise<NextResponse> {
    try {
      if (!subscription) {
        throw new BadRequestError('No subscription provided');
      }

      const VAPID_PUBLIC_KEY = await SecretsManagerUtil.getSecretValue(process.env.PROJECT_SECRET!, 'VAPID_PUBLIC_KEY');
      const VAPID_PRIVATE_KEY = await SecretsManagerUtil.getSecretValue(process.env.PROJECT_SECRET!, 'VAPID_PRIVATE_KEY');
      const VAPID_SUBJECT = `mailto:${await SecretsManagerUtil.getSecretValue(process.env.PROJECT_SECRET!, 'VAPID_SUBJECT')}`;

      webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

      await webpush.sendNotification(subscription, JSON.stringify(payload));

      return new NextResponse(null);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
