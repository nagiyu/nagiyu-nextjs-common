import APIUtil from '@client-common/utils/APIUtil';
import IdentifierUtil from '@client-common/utils/IdentifierUtil.server';
import { IdentifierType } from '@client-common/types/IdentifierType';
import { IDENTIFIER_TYPES } from '@client-common/consts/IdentifierTypeConst';

export interface IdentifierResponse {
  identifier: string | null;
  type: IdentifierType;
}

export async function GET() {
  APIUtil.apiHandler(async () => {
    const userId = await IdentifierUtil.getIdentifier();

    const result: IdentifierResponse = {
      identifier: userId,
      type: userId ? IDENTIFIER_TYPES.USER : IDENTIFIER_TYPES.NONE
    };

    return result;
  });
}
