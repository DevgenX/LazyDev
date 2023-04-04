import InputAPI from "../components/InputAPI";
import AnswerBox from "../components/AnswerBox";
import ModelSelect from "../components/ModelSelect";
import QueryBlock from "../components/QueryBlock";
import LanguageSelect from "../components/LanguageSelect";
import { useEffect, useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";

const Home = () => {
  const [inputLanguage, setInputLanguage] = useState("JavaScript");
  const [outputLanguage, setOutputLanguage] = useState("Python");
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [loading, setLoading] = useState(false);
  const [hasTranslated, setHasTranslated] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const handleTranslate = async () => {
    const maxCodeLength = model === "gpt-3.5-turbo" ? 6000 : 12000;

    if (!apiKey) {
      alert("Please enter an API key.");
      return;
    }

    if (inputLanguage === outputLanguage) {
      alert("Please select different languages.");
      return;
    }

    if (!inputCode) {
      alert("Please enter some code.");
      return;
    }

    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`
      );
      return;
    }

    setLoading(true);
    setOutputCode("");

    const controller = new AbortController();

    const body = {
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
      apiKey,
    };

    const response = await fetch("http://localhost:4999/api/translator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      alert("Something went wrong.");
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert("Something went wrong.");
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let code = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      code += chunkValue;

      setOutputCode((prevCode) => prevCode + chunkValue);
    }

    setLoading(false);
    setHasTranslated(true);
    copyToClipboard(code);
  };

  const copyToClipboard = (text) => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  const handleApiKeyChange = (value) => {
    setApiKey(value);

    localStorage.setItem("apiKey", value);
  };

  useEffect(() => {
    if (hasTranslated) {
      handleTranslate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputLanguage]);

  useEffect(() => {
    const apiKey = localStorage.getItem("apiKey");

    if (apiKey) {
      setApiKey(apiKey);
    }
  }, []);

  return (
    <Container>
      <div className="homepage">
        <title>Code Translator</title>
        <meta
          name="description"
          content="Use AI to translate code from one language to another."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        <Row>
          <div className="title font-bold">AI Code Translator</div>
          <div className="mt-6 text-center text-sm">
            <InputAPI apiKey={apiKey} onChange={handleApiKeyChange} />
          </div>

          <div className="my-2 text-center  text-xs">
            {loading
              ? "Translating..."
              : hasTranslated
              ? "Output copied to clipboard!"
              : 'Enter some code and click "Translate"'}
          </div>

          <div className="models">
            <ModelSelect model={model} onChange={(value) => setModel(value)} />

            <Button
              className="w-[140px] cursor-pointer rounded-md px-4 py-2 font-bold"
              onClick={() => handleTranslate()}
              disabled={loading}
            >
              {loading ? "Translating..." : "Translate"}
            </Button>
          </div>

          <Col>
            <div className="text-center text-xl font-bold">Input</div>
            <LanguageSelect
              language={inputLanguage}
              onChange={(value) => {
                setInputLanguage(value);
                setHasTranslated(false);
                setInputCode("");
                setOutputCode("");
              }}
            />
            {inputLanguage === "Natural Language" ? (
              <QueryBlock
                text={inputCode}
                editable={!loading}
                onChange={(value) => {
                  setInputCode(value);
                  setHasTranslated(false);
                }}
              />
            ) : (
              <AnswerBox
                code={inputCode}
                editable={!loading}
                onChange={(value) => {
                  setInputCode(value);
                  setHasTranslated(false);
                }}
              />
            )}
          </Col>
          <Col>
            <div className="text-center text-xl font-bold">Output</div>
            <LanguageSelect
              language={outputLanguage}
              onChange={(value) => {
                setOutputLanguage(value);
                setOutputCode("");
              }}
            />

            {outputLanguage === "Natural Language" ? (
              <QueryBlock text={outputCode} />
            ) : (
              <AnswerBox code={outputCode} />
            )}
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Home;
