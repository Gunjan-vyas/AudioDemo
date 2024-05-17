import "regenerator-runtime/runtime";
import "./App.css";
import AudioPermissionChecker from "./components/AudioPermissionChecker";
import PocOfCounter from "./components/PocOfCounter";

//firebase code in notion
// const db = getDatabase(app);

function App() {
  return (
    <>
      <AudioPermissionChecker />
      <h2>Audio Jap Counter</h2>
      <PocOfCounter />
    </>
  );
}

export default App;
