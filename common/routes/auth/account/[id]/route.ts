import { NextRequest } from 'next/server';

import SimpleAuthService from '@common/services/auth/SimpleAuthService';
import { AuthDataType } from '@common/interfaces/data/AuthDataType';
import { UnauthorizedError } from '@common/errors';

import APIUtil from '@client-common/utils/APIUtil';
import AuthUtil from '@client-common/auth/AuthUtil';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  APIUtil.apiHandler(async () => {
    const googleUserID = await AuthUtil.getGoogleUserIdFromSession();

    if (!googleUserID) {
      throw new UnauthorizedError();
    }

    const id = (await params).id;
    const body: AuthDataType = await request.json();
    const now = Date.now();

    const requestData: AuthDataType = {
      ...body,
      id,
      googleUserId: googleUserID,
      update: now,
    };

    const service = new SimpleAuthService();
    await service.update(requestData);

    return requestData;
  });
}

// export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//   const id = (await params).id;

//   const service = new SimpleAuthService();
//   await service.delete(id);

//   return APIUtil.ReturnSuccess();
// }
