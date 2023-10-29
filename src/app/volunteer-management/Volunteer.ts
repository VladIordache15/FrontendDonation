import {Role} from "../user-administration/models/role";
import {Campaign} from "../campaign-management/campaign";

export interface Volunteer {
  id?: number,
  firstName: string,
  lastName: string,
  mobileNumber: string,
  username?: string,
  email: string,
  roles?: Role[],
  campaigns?: Campaign[],
  password?: string,
  active?: boolean,
  firstLogin?: boolean,
  retryCount?: number,
  adress: string,
  JobsCount?: number
}
