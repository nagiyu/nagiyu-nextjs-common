import APIUtil from '@client-common/utils/APIUtil';
import IdentifierUtil from '@client-common/utils/IdentifierUtil.server';
import { IdentifierType } from '@client-common/types/IdentifierType';

export interface IdentifierResponse {
  identifier: string | null;
  type: IdentifierType;
}

export async function GET() {
  const userId = await IdentifierUtil.getIdentifier();
  
  const result: IdentifierResponse = {
    identifier: userId,
    type: userId ? 'user' : 'none'
  };
  
  return APIUtil.ReturnSuccess(result);
}
