import { NextRequest } from 'next/server';

import SimpleAuthService from '@common/services/auth/SimpleAuthService';
import { BadRequestError, NotFoundError } from '@common/errors';

import AuthUtil from '@client-common/auth/AuthUtil';
import APIUtil from '@client-common/utils/APIUtil';

async function handleGoogleOption() {
  const googleUserID = await AuthUtil.getGoogleUserIdFromSession();

  const authService = new SimpleAuthService();
  const user = await authService.getByGoogleUserId(googleUserID);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ option: string }> }) {
  return APIUtil.apiHandler(async () => {
    const option = (await params).option;

    if (!option) {
      throw new BadRequestError('Option is required');
    }

    switch (option) {
      case 'google':
        return handleGoogleOption();

      default:
        throw new BadRequestError('Invalid option');
    }
  });
}
