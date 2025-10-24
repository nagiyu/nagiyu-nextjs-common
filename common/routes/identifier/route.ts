import APIUtil, { APIResponseOptions } from '@client-common/utils/APIUtil';
import IdentifierUtil from '@client-common/utils/IdentifierUtil.server';
import { IdentifierType } from '@client-common/types/IdentifierType';
import { IDENTIFIER_TYPES } from '@client-common/consts/IdentifierTypeConst';

export interface IdentifierResponse {
  identifier: string | null;
  type: IdentifierType;
}

const FEATURE = 'Identifier';

export async function getHandler(rootFeature: string) {
  const options: APIResponseOptions = {
    rootFeature,
    feature: FEATURE,
    noCache: true,
  };

  return APIUtil.apiHandler(async () => {
    const userId = await IdentifierUtil.getIdentifier();

    const result: IdentifierResponse = {
      identifier: userId,
      type: userId ? IDENTIFIER_TYPES.USER : IDENTIFIER_TYPES.NONE
    };

    return result;
  }, options);
}
