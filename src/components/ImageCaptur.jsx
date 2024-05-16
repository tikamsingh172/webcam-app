import React, { useRef, useCallback } from "react";
import Webcam from "react-webcam";

const ImageCapture = () => {
  const webcamRef = useRef(null);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
    const binaryImage = atob(imageSrc.split(",")[1]);

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer id_token",
      },
      body: JSON.stringify({
        bucket: "face-mementos",
        property_folder: "molecule_club_ifc",
        qt_folder: "qt_faces",
        camera_folder: "camera_1",
        filename: "Molecule_Cam1_1.jpg",
        image: binaryImage,
      }),
    };

    const response = await fetch(
      "https://eww5a3ve13.execute-api.ap-south-1.amazonaws.com/default/lambda-upload-image-trigger",
      requestOptions
    );
    const data = await response.json();
    console.log(data);
  }, [webcamRef]);

  return (
    <>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={capture}>Capture</button>
    </>
  );
};

export default ImageCapture;