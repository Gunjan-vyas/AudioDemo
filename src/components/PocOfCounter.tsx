import "regenerator-runtime/runtime";
import { useEffect, useState } from "react";
import "../App.css";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Player } from "@lottiefiles/react-lottie-player";
import success from "../assets/success.json";

const PocOfCounter = () => {
  const [count, setCount] = useState(() => {
    // Initialize count from local storage or default to 0
    const savedCount = parseInt(localStorage.getItem("count") || "0", 10);
    return isNaN(savedCount) ? 0 : savedCount;
  });
  const [onSuccess, setOnSuccess] = useState(false);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    // Initialize the audio context
    const audioContext = new (window.AudioContext)();
    // Mute the audio context
    audioContext.suspend();
    return () => {
      // Clean up the audio context when component unmounts
      audioContext.close();
    };
  }, []);

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const onStop = () => {
    localStorage.setItem("count", count.toString());
  };

  const jugaad = () => {
    const countedValue = countOccurrences(transcript, "Ram");
    setCount(Math.max(count, count + countedValue));
    onStop();
    resetTranscript();
    checkSuccess();
  };

  function countOccurrences(text: string, word: string) {
    // Create a regular expression to match the word with word boundaries
    const regex = new RegExp("\\b" + word + "\\b", "gi");
    const matches = text.match(regex);
    console.log("matches", matches);
    // If matches are found, return the count, otherwise return 0
    return matches ? matches.length : 0;
  }

  useEffect(() => {
    console.log("inside useEffect", { transcript }, transcript.includes("Ram"));
    if (transcript.includes("Ram")) setTimeout(jugaad, 250);
  }, [transcript]);

  function checkSuccess() {
    if (count && count % 108 === 0) {
      setOnSuccess(true);
    } else {
      setOnSuccess(false);
    }
  }

  if (!browserSupportsSpeechRecognition) {
    return <h1>Your browser does not support speech recognition, try giving access to your microphones</h1>;
  }

  return (
    <>
      <div className="container card">
        <div>
          RAAM Jap count value = <h1>{count} </h1>
        </div>
        <div className="btn-container">
          <button onClick={startListening}>Start</button>
          <button onClick={stopListening}>Stop</button>
          <button onClick={onStop}>Save</button>
        </div>
      </div>
      {onSuccess && <Player src={success} className="lottie-container" autoplay />}
    </>
  );
};

export default PocOfCounter;
