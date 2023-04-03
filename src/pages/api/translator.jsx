import { OpenAIStream } from "../../utils";

export const config = {
  runtime: "edge",
};

const handler = async (req) => {
  try {
    const { inputLanguage, outputLanguage, inputCode, model, apiKey } =
      await req.json();

    const stream = await OpenAIStream(
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
      apiKey
    );

    return new Response(stream);
  } catch (error) {
    return new Response("Error", { status: 500 });
  }
};

export default handler;
