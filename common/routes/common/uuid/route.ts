import CommonUtil from '@common/utils/CommonUtil';

import APIUtil, { APIResponseOptions } from '@client-common/utils/APIUtil';

export interface UUIDResponse {
  uuid: string;
}

const FEATURE = 'UUID';

export async function getHandler(rootFeature: string) {
  const options: APIResponseOptions = {
    rootFeature,
    feature: FEATURE,
    noCache: true,
  };

  return APIUtil.apiHandler(async () => {
    const result: UUIDResponse = {
      uuid: CommonUtil.generateUUID(),
    };

    return result;
  }, options);
}
