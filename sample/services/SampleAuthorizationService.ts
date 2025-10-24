import { AuthorizationServiceBase } from '@common/services/authorization/AuthorizationServiceBase';
import { BadRequestError } from '@common/errors';
import { PermissionLevel } from '@common/enums/PermissionLevel';
import { PermissionMatrix } from '@common/interfaces/authorization/PermissionMatrix';
import { SampleFeature } from '@/consts/SampleConst';
import { UserType } from '@common/enums/UserType';

const SamplePermissionMatrix: PermissionMatrix<SampleFeature> = {
  [SampleFeature.HOME]: {
    [UserType.GUEST]: PermissionLevel.VIEW,
    [UserType.AUTHENTICATED]: PermissionLevel.VIEW,
    [UserType.PREMIUM]: PermissionLevel.VIEW,
    [UserType.ADMIN]: PermissionLevel.VIEW,
  },
  [SampleFeature.SAMPLE]: {
    [UserType.GUEST]: PermissionLevel.VIEW,
    [UserType.AUTHENTICATED]: PermissionLevel.VIEW,
    [UserType.PREMIUM]: PermissionLevel.VIEW,
    [UserType.ADMIN]: PermissionLevel.VIEW,
  },
};

export class SampleAuthorizationService extends AuthorizationServiceBase<SampleFeature> {
  public override validate(feature: SampleFeature, level: PermissionLevel): void {
    super.validate(feature, level);

    if (!feature || !Object.values(SampleFeature).includes(feature as SampleFeature)) {
      throw new BadRequestError('Invalid feature');
    }
  }

  protected async getPermissionMatrix(): Promise<PermissionMatrix<SampleFeature>> {
    return SamplePermissionMatrix;
  }

  protected async getUserType(): Promise<UserType> {
    return UserType.GUEST;
  }

  protected async getUserId(): Promise<string | undefined> {
    return undefined;
  }
}
