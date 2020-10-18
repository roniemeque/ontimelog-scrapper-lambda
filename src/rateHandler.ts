import { CloudWatchLogsHandler } from "aws-lambda";
import { sendToPhone } from "./lib/ifttt";
import { scrapLastResultForCpf } from "./scrap";
import {
  isEventSavedAlready,
  saveEvent,
  fetchAllActivesCpfs,
} from "./helpers/database";

export const checkStatusUpdates: CloudWatchLogsHandler = async () => {
  try {
    const allCpfs = (await fetchAllActivesCpfs()) || [];

    await Promise.all(
      allCpfs.map(async (cpf) => {
        console.log(`Searching for cpf: ${cpf}`);

        const { time, message } = process.env.IS_OFFLINE
          ? { time: "", message: "" }
          : await scrapLastResultForCpf(cpf);

        const eventAlreadySaved = await isEventSavedAlready(time, message);
        console.log({ cpf, eventAlreadySaved });

        if (!eventAlreadySaved) {
          console.log(`New event`, { time, message });

          await saveEvent(time, message);
          await sendToPhone(time, message);
        }
      })
    );

    return {
      allCpfs,
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};
