import React, { useEffect, useState } from "react";

const AudioPermissionChecker: React.FC = () => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionState>("prompt");

  useEffect(() => {
    // Check microphone permissions
    const checkMicrophonePermissions = async () => {
      try {
        const permission = await navigator.permissions.query({ name: "microphone" as PermissionName });
        setPermissionStatus(permission.state);

        // Listen for changes to the permission status
        permission.onchange = () => {
          setPermissionStatus(permission.state);
        };
      } catch (error) {
        console.error("Error checking microphone permissions:", error);
      }
    };

    checkMicrophonePermissions();
  }, []);

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Do something with the audio stream
      console.log("Microphone access granted");
      stream.getTracks().forEach((track) => track.stop()); // Stop the stream to release the microphone
    } catch (error) {
      console.error("Error requesting microphone access:", error);
    }
  };

  return (
    <div>
      <p>Microphone permission status: {permissionStatus}</p>
      {permissionStatus !== "granted" && <button onClick={requestMicrophoneAccess}>Request Microphone Access</button>}
    </div>
  );
};

export default AudioPermissionChecker;
