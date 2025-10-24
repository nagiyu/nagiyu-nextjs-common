import CommonUtil from '@common/utils/CommonUtil';

import APIUtil, { APIResponseOptions } from '@client-common/utils/APIUtil';

const FEATURE = 'Terminal';

export async function getHandler(rootFeature: string) {
  const options: APIResponseOptions = {
    rootFeature,
    feature: FEATURE,
    noCache: true,
  };

  return APIUtil.apiHandler(async () => {
    return {
      terminalId: CommonUtil.generateUUID()
    };
  }, options);
}
