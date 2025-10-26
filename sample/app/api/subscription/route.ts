import { NextRequest } from 'next/server';

import APIUtil, { APIResponseOptions } from '@client-common/utils/APIUtil';
import { SubscriptionAPIHelper } from '@client-common/helpers/api/SubscriptionAPIHelper';

import { ROOT_FEATURE, SampleFeature } from '@/consts/SampleConst';

const options: APIResponseOptions = {
  rootFeature: ROOT_FEATURE,
  feature: SampleFeature.HOME,
};

export async function GET(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return SubscriptionAPIHelper.get(request as any);
  }, options);
}

export async function POST(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return SubscriptionAPIHelper.post(request as any);
  }, options);
}

export async function PUT(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return SubscriptionAPIHelper.put(request as any);
  }, options);
}

export async function DELETE(request: NextRequest) {
  return APIUtil.apiHandler(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SubscriptionAPIHelper.delete(request as any);
  }, options);
}
