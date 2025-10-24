import { NextRequest } from 'next/server';

import { AuthorizationServiceBase } from '@common/services/authorization/AuthorizationServiceBase';
import { PermissionLevel } from '@common/enums/PermissionLevel';

import APIUtil, { APIResponseOptions } from '@client-common/utils/APIUtil';

/**
 * 権限チェックAPIのリクエスト型
 */
export interface CheckPermissionRequestType<Feature extends string = string> {
  feature: Feature;
  level: PermissionLevel;
}

/**
 * 権限チェックAPIのレスポンス型
 */
export interface CheckPermissionResponseType {
  hasPermission: boolean;
}

// Disable caching for this route to ensure fresh permission checks
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FEATURE = 'CheckPermission';

/**
 * 権限チェックAPI
 * クライアントから指定された機能と権限レベルに対する権限を確認
 */
export async function postHandler<Feature extends string = string>(
  rootFeature: string,
  request: NextRequest,
  authorizationService: AuthorizationServiceBase<Feature>
) {
  const options: APIResponseOptions = {
    rootFeature,
    feature: FEATURE,
  };

  return APIUtil.apiHandler(async () => {
    const body: CheckPermissionRequestType<Feature> = await request.json();
    const { feature, level } = body;

    // 入力検証
    authorizationService.validate(feature, level);

    // 権限チェック
    const hasPermission = await authorizationService.authorize(
      feature,
      level
    );

    const response: CheckPermissionResponseType = { hasPermission };

    return response;
  }, options);
}
