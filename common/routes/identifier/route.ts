import APIUtil from '@client-common/utils/APIUtil';
import IdentifierUtil from '@client-common/utils/IdentifierUtil.server';

export interface IdentifierResponse {
  identifier: string | null;
  type: 'user' | 'terminal' | 'none';
}

export async function GET() {
  const userId = await IdentifierUtil.getIdentifier();
  
  const result: IdentifierResponse = {
    identifier: userId,
    type: userId ? 'user' : 'none'
  };
  
  return APIUtil.ReturnSuccess(result);
}
