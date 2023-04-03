const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAIStream } = require("./src/utils");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/translator", async (req, res) => {
  try {
    const { inputLanguage, outputLanguage, inputCode, model, apiKey } =
      req.body;

    const stream = await OpenAIStream(
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
      apiKey
    );

    res.setHeader("Content-Type", "text/html");
    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
