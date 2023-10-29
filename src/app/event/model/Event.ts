import {Status} from "./Status";

export interface Eventt{
  id?: number,
  eventName: string,
  eventStartDate: Date,
  eventEndDate: Date,
  description: string,
  eventStatus: Status,
  notes: string,
  openJobs: number,
  volsRequired: number,
  volsRegistered: number,

}
