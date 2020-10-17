import { APIGatewayProxyHandler } from "aws-lambda";
import { scrapLastResultForCpf } from "./scrap";

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

    const { time, message } = await scrapLastResultForCpf(cpf);

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
