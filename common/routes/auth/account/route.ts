import { NextRequest } from 'next/server';

import CommonUtil from '@common/utils/CommonUtil';
import SimpleAuthService from '@common/services/auth/SimpleAuthService';
import { AuthDataType } from '@common/interfaces/data/AuthDataType';
import { UnauthorizedError } from '@common/errors';

import APIUtil from '@client-common/utils/APIUtil';
import AuthUtil from '@client-common/auth/AuthUtil';

export async function GET() {
  return APIUtil.apiHandler(async () => {
    const service = new SimpleAuthService();
    const googleUserID = await AuthUtil.getGoogleUserIdFromSession();

    if (!googleUserID) {
      throw new UnauthorizedError();
    }

    const user = await service.getByGoogleUserId(googleUserID);

    return user ? [user] : [];
  });
}

export async function POST(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    const googleUserID = await AuthUtil.getGoogleUserIdFromSession();

    if (!googleUserID) {
      throw new UnauthorizedError();
    }

    const body: AuthDataType = await request.json();
    const now = Date.now();

    const requestData: AuthDataType = {
      ...body,
      id: CommonUtil.generateUUID(),
      googleUserId: googleUserID,
      create: now,
      update: now,
    };

    const service = new SimpleAuthService();
    await service.create(requestData);

    return requestData;
  });
}
