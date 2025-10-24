import { NextRequest } from 'next/server';

import { POST as PostBase } from '@client-common/routes/auth/check-permission/route';

import { SampleAuthorizationService } from '@/services/SampleAuthorizationService';

const authorizationService = new SampleAuthorizationService();

export async function POST(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return PostBase(request as any, authorizationService);
}
