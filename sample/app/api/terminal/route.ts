import { getHandler } from '@client-common/routes/terminal/route';

import { ROOT_FEATURE } from '@/consts/SampleConst';

export async function GET() {
  return getHandler(ROOT_FEATURE);
}
