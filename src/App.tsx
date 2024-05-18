import "regenerator-runtime/runtime";
import "./App.css";
import AudioPermissionChecker from "./components/AudioPermissionChecker";
// import SpeechToTextComponent from "./components/SpeechToTextComponent"; // TODO: NEED to see more on how to do it using google cloud speech api
import { Analytics } from "@vercel/analytics/react";
import PocOfCounter from "./components/PocOfCounter";
//firebase code in notion
// const db = getDatabase(app);

function App() {
  return (
    <>
      <Analytics />
      <AudioPermissionChecker />
      <h2>Audio Jap Counter</h2>
      <PocOfCounter />
    </>
  );
}

export default App;
