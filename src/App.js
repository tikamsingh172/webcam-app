import axios from "axios";
import React, { useRef, useCallback, useState, useEffect } from "react";
import Webcam from "react-webcam";

const App = () => {
  const webcamRef = useRef(null);
  const [hasWebcam, setHasWebcam] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoInput = devices.some(
          (device) => device.kind === "videoinput"
        );
        setHasWebcam(videoInput);
      })
      .catch((err) => {
        setError(err);
        console.error("Error accessing media devices.", err);
      });
  }, []);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      console.error("No image captured.");
      return;
    }

    const formData = new FormData();
    const binaryImage = atob(imageSrc.split(",")[1]); // Decode the base64
    const array = [];
    for (let i = 0; i < binaryImage.length; i++) {
      array.push(binaryImage.charCodeAt(i));
    }
    const imageBlob = new Blob([new Uint8Array(array)], { type: "image/jpeg" });

    formData.append("bucket", "face-mementos");
    formData.append("property_folder", "molecule_club_ifc");
    formData.append("qt_folder", "qt_faces");
    formData.append("camera_folder", "camera_1");
    formData.append("filename", "Molecule_Cam1_1.jpg");
    formData.append("image", imageBlob, "Molecule_Cam1_1.jpg");

    try {
      const response = await axios.put(
        "https://eww5a3ve13.execute-api.ap-south-1.amazonaws.com/default/lambda-upload-image-trigger",
        formData, // Sending the FormData
        {
          headers: {
            Authorization: "Bearer id_token",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error while uploading image:", error);
    }
  }, [webcamRef]);

  return (
    <>
      {error ? (
        <p>Error accessing the webcam: {error.message}</p>
      ) : hasWebcam ? (
        <>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          <button onClick={capture}>Capture</button>
        </>
      ) : (
        <p>No webcam detected.</p>
      )}
    </>
  );
};

export default App;
