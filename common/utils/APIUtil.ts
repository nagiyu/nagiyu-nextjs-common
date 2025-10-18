import { NextResponse } from "next/server";

export interface APIResponseOptions {
  noCache?: boolean;
}

export default class APIUtil {
  private static applyCacheHeaders(response: NextResponse, options?: APIResponseOptions): NextResponse {
    if (options?.noCache) {
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    }
    return response;
  }

  public static ReturnSuccess(data?: object, options?: APIResponseOptions) {
    if (!data) {
      return new NextResponse(null);
    }

    const response = NextResponse.json(data);
    return this.applyCacheHeaders(response, options);
  }

  public static ReturnSuccessWithObject(data: object, options?: APIResponseOptions) {
    const response = NextResponse.json(data);
    return this.applyCacheHeaders(response, options);
  }

  public static ReturnBadRequest(message: string, options?: APIResponseOptions) {
    const response = NextResponse.json({ error: message }, { status: 400 });
    return this.applyCacheHeaders(response, options);
  }

  public static ReturnUnauthorized(options?: APIResponseOptions): NextResponse {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return this.applyCacheHeaders(response, options);
  }

  public static ReturnNotFound(message: string = 'Not Found', options?: APIResponseOptions): NextResponse {
    const response = NextResponse.json({ error: message }, { status: 404 });
    return this.applyCacheHeaders(response, options);
  }

  public static ReturnInternalServerError(data: object, options?: APIResponseOptions): NextResponse {
    const response = NextResponse.json(data, { status: 500 });
    return this.applyCacheHeaders(response, options);
  }

  public static ReturnInternalServerErrorWithError(error: any, options?: APIResponseOptions): NextResponse {
    const msg = error instanceof Error ? error.message : String(error);
    const response = NextResponse.json({ error: msg }, { status: 500 });
    return this.applyCacheHeaders(response, options);
  }
}
