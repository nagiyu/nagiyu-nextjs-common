import CommonUtil from '@common/utils/CommonUtil';

import APIUtil from '@client-common/utils/APIUtil';

export interface UUIDResponse {
  uuid: string;
}

export async function GET() {
  APIUtil.apiHandler(async () => {
    const result: UUIDResponse = {
      uuid: CommonUtil.generateUUID(),
    };

    return result;
  }, { noCache: true });
}
