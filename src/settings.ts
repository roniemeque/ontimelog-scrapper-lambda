export const settings = {
  IFTTT_KEY: process.env.IFTTT_KEY as string,
  FAUNA_KEY: process.env.FAUNA_KEY as string,
  EVENTS_COLLECTION_NAME: "delivery_events",
  CPFS_COLLECTION_NAME: "active_cpfs",
  ALL_EVENTS_INDEX_NAME: "all_events",
  ALL_CPFS_INDEX_NAME: "all_cpfs",
};
