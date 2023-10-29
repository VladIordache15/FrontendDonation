export interface EventJob{
  id?: number,
  jobTitle: string,
  jobDescription: string,
  jobStartTime : Date,
  jobEndTime: Date,
  volsRequired: number,
  volsRegistered : number,
  volsCheckedIn: number

}
