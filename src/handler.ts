import { APIGatewayProxyHandler } from "aws-lambda";
import { sendToPhone } from "./lib/ifttt";
import { scrapLastResultForCpf } from "./scrap";
import { isEventSavedAlready, saveEvent } from "./helpers/database";

const answerApi = (body: any, statusCode = 200) => ({
  statusCode,
  body: JSON.stringify(body),
});

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

    if (!(await isEventSavedAlready(time, message))) {
      await saveEvent(time, message);
    }

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
