import CommonUtil from '@common/utils/CommonUtil';

import APIUtil from '@client-common/utils/APIUtil';

export async function GET() {
  APIUtil.apiHandler(async () => {
    return {
      terminalId: CommonUtil.generateUUID()
    };
  });
}
