import {
  FetchGeneralPrivateInfo, FetchGeneralPublicInfo, GeneralActionType,
  PrivateGeneralSetInfo, PublicGeneralSetInfo,
} from './actions';
import { LoginMethods } from '../../clients/server.generated';

export function generalPrivateFetchInfo(): FetchGeneralPrivateInfo {
  return { type: GeneralActionType.FetchPrivateInfo };
}

export function generalPublicFetchInfo(): FetchGeneralPublicInfo {
  console.log('create fetch action');
  return { type: GeneralActionType.FetchPublicInfo };
}

export function generalPrivateSetInfo(financialYears: number[]): PrivateGeneralSetInfo {
  return { type: GeneralActionType.SetPrivateInfo, financialYears };
}

export function generalPublicSetInfo(loginMethod: LoginMethods): PublicGeneralSetInfo {
  console.log('create set action');
  return { type: GeneralActionType.SetPublicInfo, loginMethod };
}
