import { APIGatewayProxyHandler } from "aws-lambda";
import { scrapLastResultForCpf } from "./scrap";
import fetch from "node-fetch";

const KEY = "";

const answerApi = (body: any, statusCode = 200) => ({
  statusCode,
  body: JSON.stringify(body),
});

const sendToPhone = async (time?: string, message?: string) => {
  if (!time || !message) {
    return;
  }

  return await fetch(
    `https://maker.ifttt.com/trigger/status_checked/with/key/${KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value1: time,
        value2: message,
      }),
    }
  );
};

export const fetchStatus: APIGatewayProxyHandler = async (event, context) => {
  try {
    const { cpf } = JSON.parse(event.body || "");

    if (!cpf) {
      return answerApi(
        {
          message: "CPF is required",
        },
        403
      );
    }

    const { time, message } = process.env.IS_OFFLINE
      ? { time: "", message: "" }
      : await scrapLastResultForCpf(cpf);

    await sendToPhone(time, message);

    return answerApi({ time, message });
  } catch (error) {
    console.error(error);
    return answerApi(
      {
        message: "Something went wrong",
      },
      500
    );
  }
};
