import { OpenAIStream } from "./src/utils/index.js";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/translator", async (req, res) => {
  try {
    const { inputLanguage, outputLanguage, inputCode, model, apiKey } =
      req.body;

    // console.log(req.body);

    const response = await OpenAIStream(
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
      apiKey
    );

    let data = "";
    const reader = response.body.getReader();

    function readStream() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            console.log("Stream finished.");
            res.status(200).send(data);
            return;
          }
          console.log(`Received ${value.length} bytes of data.`);
          // Process the received data as needed
          data += new TextDecoder().decode(value);
          readStream();
        })
        .catch((error) => {
          console.error(`Error while reading stream: ${error}`);
          res.status(500).send("Error");
        });
    }

    readStream();
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

const port = process.env.PORT || 4999;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
