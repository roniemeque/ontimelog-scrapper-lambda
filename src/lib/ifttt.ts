import fetch from "node-fetch";
import { settings } from "../settings";

export const sendToPhone = async (time?: string, message?: string) => {
  console.log(`Warning on: `, { time, message });

  if (!time || !message) {
    return;
  }

  return await fetch(
    `https://maker.ifttt.com/trigger/status_checked/with/key/${settings.IFTTT_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value1: `📦 Encomenda`,
        value2: `${time}: ${message}`,
        value3: `https://ontime.sinclog.com.br/Rastreamentos/Rastreamento`,
      }),
    }
  );
};
