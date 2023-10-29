import {Volunteer} from "../volunteer-management/Volunteer";
import {EventJob} from "../eventJob/EventJob";

export interface SignUp{
  id?: number,
  checkedInDate:Date,
  subDate:Date,
  startDateJob:Date,
  ednDateJob:Date,
  checkedIn: boolean,
  volunteer?: Volunteer,
  eventJob?: EventJob
}
