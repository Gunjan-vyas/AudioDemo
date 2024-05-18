import React, { useState } from "react";
import { SpeechClient, protos } from "@google-cloud/speech";

const speechClient = new SpeechClient();

const SpeechToTextComponent: React.FC = () => {
  const [transcript, setTranscript] = useState<string>("");

  const startRecognition = async () => {
    try {
      const audioBlob = await captureAudio();
      const response = await transcribeAudio(audioBlob);
      setTranscript(response);
    } catch (error) {
      console.error("Error during speech recognition:", error);
    }
  };

  const captureAudio = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          const audioChunks: BlobPart[] = [];

          mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
            resolve(audioBlob);
          };

          mediaRecorder.start();

          setTimeout(() => {
            mediaRecorder.stop();
          }, 5000); // Record for 5 seconds
        })
        .catch((error) => reject(error));
    });
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const audioArrayBuffer = await audioBlob.arrayBuffer();
    const audioUint8Array = new Uint8Array(audioArrayBuffer);
    const audioBase64 = btoa(String.fromCharCode(...audioUint8Array));

    const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
      audio: {
        content: audioBase64,
      },
      config: {
        encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
        sampleRateHertz: 16000,
        languageCode: "en-US",
      },
    };

    const [response] = await speechClient.recognize(request);
    const transcription =
      response.results
        ?.map((result) => result.alternatives?.[0].transcript)
        .filter((transcript) => transcript !== undefined)
        .join("\n") || "";

    return transcription;
  };

  return (
    <div>
      <button onClick={startRecognition}>Start Recognition</button>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default SpeechToTextComponent;
