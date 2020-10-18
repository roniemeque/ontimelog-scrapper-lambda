import { allItemsByIndex, createItem } from "../lib/fauna";
import { settings } from "../settings";

export const fetchAllActivesCpfs = async () => {
  const allCpfs = (await allItemsByIndex(settings.ALL_CPFS_INDEX_NAME)) || [];

  const textOnly = allCpfs.map(({ cpf }) => cpf);

  return textOnly;
};

export const isEventSavedAlready = async (
  time?: string,
  message?: string
): Promise<boolean> => {
  const allEvents = await allItemsByIndex(settings.ALL_EVENTS_INDEX_NAME);

  const exists = !!allEvents?.find(
    (event) => event.message === message && event.time === time
  );

  return exists;
};

export const saveEvent = async (time?: string, message?: string) => {
  const created = await createItem(settings.EVENTS_COLLECTION_NAME, {
    time,
    message,
  });

  return created;
};
