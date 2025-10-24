import CommonUtil from '@common/utils/CommonUtil';

import APIUtil from '@client-common/utils/APIUtil';

export async function GET() {
  return APIUtil.apiHandler(async () => {
    return {
      terminalId: CommonUtil.generateUUID()
    };
  });
}
