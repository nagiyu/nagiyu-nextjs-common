import APIUtil from '@client-common/utils/APIUtil';
import IdentifierUtil from '@client-common/utils/IdentifierUtil.server';
import { IdentifierType } from '@client-common/types/IdentifierType';
import {
  IDENTIFIER_TYPE_USER,
  IDENTIFIER_TYPE_NONE
} from '@client-common/consts/IdentifierTypeConst';

export interface IdentifierResponse {
  identifier: string | null;
  type: IdentifierType;
}

export async function GET() {
  const userId = await IdentifierUtil.getIdentifier();
  
  const result: IdentifierResponse = {
    identifier: userId,
    type: userId ? IDENTIFIER_TYPE_USER : IDENTIFIER_TYPE_NONE
  };
  
  return APIUtil.ReturnSuccess(result);
}
