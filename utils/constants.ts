export const CONSTANTS = {
  HIT_COUNTER_TABLE_NAME: "Hits",
  HIT_COUNTER_HANDLER_NAME: "HitCounterHandler",
  READ_CAPACITY: 5,
  CONNECTION_ARN: "", //Use your connection value
} as const;

export const TEST_CONSTANTS = {
  DOWNSTREAM_FUNCTION_NAME: "TestFunction22AD90FC",
  HITS_TABLE_NAME: "MyTestConstructHits24A357F0",
} as const;
