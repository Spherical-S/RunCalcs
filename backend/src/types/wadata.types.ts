export type EventToPointsMap = {
  [EventName: string]: number[][];
};

export type CategoryToGenderMap = {
  men: EventToPointsMap;
  women: EventToPointsMap;
};

export type WAData = {
  field: CategoryToGenderMap;
  track: CategoryToGenderMap;
  short: CategoryToGenderMap;
  road: CategoryToGenderMap;
}