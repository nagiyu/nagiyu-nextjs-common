import { NextResponse } from 'next/server';

import ErrorUtil from '@common/utils/ErrorUtil';
import { BadRequestError, UnauthorizedError, NotFoundError } from '@common/errors';
import { AuthorizationServiceBase } from '@common/services/authorization/AuthorizationServiceBase';
import { PermissionLevel } from '@common/enums/PermissionLevel';

export interface APIResponseOptions<Feature extends string = string> {
  rootFeature: string;
  feature: Feature;
  noCache?: boolean;
  authorization?: AuthorizationOptions<Feature>;
}

export interface AuthorizationOptions<Feature extends string = string> {
  authorizationService: AuthorizationServiceBase<Feature>;
  requiredLevel: PermissionLevel;
}

export default class APIUtil {
  public static async apiHandler<Feature extends string = string>(
    handler: () => Promise<object>,
    options: APIResponseOptions<Feature>,
  ) {
    if (options?.authorization) {
      const { authorizationService, requiredLevel } = options.authorization;

      authorizationService.validate(options.feature, requiredLevel);

      const hasPermission = await authorizationService.authorize(
        options.feature,
        requiredLevel
      );

      if (!hasPermission) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    let response: NextResponse;

    try {
      const result = await handler();
      response = NextResponse.json(result);
    } catch (error) {
      if (error instanceof BadRequestError) {
        ErrorUtil.logError(options.rootFeature, options.feature, error);
        response = NextResponse.json({ error: error.message ?? 'Bad Request' }, { status: 400 });
      } else if (error instanceof UnauthorizedError) {
        ErrorUtil.logError(options.rootFeature, options.feature, error);
        response = NextResponse.json({ error: error.message ?? 'Unauthorized' }, { status: 401 });
      } else if (error instanceof NotFoundError) {
        ErrorUtil.logError(options.rootFeature, options.feature, error);
        response = NextResponse.json({ error: error.message ?? 'Not Found' }, { status: 404 });
      } else if (error instanceof Error) {
        ErrorUtil.logError(options.rootFeature, options.feature, error);
        response = NextResponse.json({ error: error.message ?? 'Internal Server Error' }, { status: 500 });
      } else {
        const message = String(error);
        ErrorUtil.logError(options.rootFeature, options.feature, new Error(String(message)));
        response = NextResponse.json({ error: message ?? 'Internal Server Error' }, { status: 500 });
      }
    }

    if (options?.noCache) {
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    }

    return response;
  }

  private static applyCacheHeaders(response: NextResponse, options?: APIResponseOptions): NextResponse {
    if (options?.noCache) {
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    }
    return response;
  }

  /**
   * @deprecated Use apiHandler instead.
   */
  public static ReturnSuccess(data?: object, options?: APIResponseOptions) {
    if (!data) {
      return new NextResponse(null);
    }

    const response = NextResponse.json(data);
    return this.applyCacheHeaders(response, options);
  }

  /**
   * @deprecated Use apiHandler instead.
   */
  public static ReturnSuccessWithObject(data: object, options?: APIResponseOptions) {
    const response = NextResponse.json(data);
    return this.applyCacheHeaders(response, options);
  }

  /**
   * @deprecated Use apiHandler instead.
   */
  public static ReturnBadRequest(message: string, options?: APIResponseOptions) {
    const response = NextResponse.json({ error: message }, { status: 400 });
    return this.applyCacheHeaders(response, options);
  }

  /**
   * @deprecated Use apiHandler instead.
   */
  public static ReturnUnauthorized(options?: APIResponseOptions): NextResponse {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return this.applyCacheHeaders(response, options);
  }

  /**
   * @deprecated Use apiHandler instead.
   */
  public static ReturnNotFound(message: string = 'Not Found', options?: APIResponseOptions): NextResponse {
    const response = NextResponse.json({ error: message }, { status: 404 });
    return this.applyCacheHeaders(response, options);
  }

  /**
   * @deprecated Use apiHandler instead.
   */
  public static ReturnInternalServerError(data: object, options?: APIResponseOptions): NextResponse {
    const response = NextResponse.json(data, { status: 500 });
    return this.applyCacheHeaders(response, options);
  }

  /**
   * @deprecated Use apiHandler instead.
   */
  public static ReturnInternalServerErrorWithError(error: any, options?: APIResponseOptions): NextResponse {
    const msg = error instanceof Error ? error.message : String(error);
    const response = NextResponse.json({ error: msg }, { status: 500 });
    return this.applyCacheHeaders(response, options);
  }
}
