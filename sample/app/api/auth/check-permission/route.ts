import { NextRequest } from 'next/server';

import { postHandler } from '@client-common/routes/auth/check-permission/route';

import { ROOT_FEATURE } from '@/consts/SampleConst';
import { SampleAuthorizationService } from '@/services/SampleAuthorizationService';

const authorizationService = new SampleAuthorizationService();

export async function POST(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return postHandler(ROOT_FEATURE, request as any, authorizationService);
}
