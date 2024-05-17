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

    const binaryImage = atob(imageSrc.split(",")[1]); // Decode the base64
    const formData = new FormData();
    formData.append("image", binaryImage);

    const idToken =
      "eyJraWQiOiJmWUpIaDNCdVwvejM2Qk93RGgzTTNDTkxKT2xWY3o0MXIwYVwvYUJcL1V1VVpvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjMTAzMmRkYS1jMDMxLTcwZDAtNTUwZS02YzU2Mjk4ZjRjZDEiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xX01aZWo2UFloMCIsImNvZ25pdG86dXNlcm5hbWUiOiJjMTAzMmRkYS1jMDMxLTcwZDAtNTUwZS02YzU2Mjk4ZjRjZDEiLCJvcmlnaW5fanRpIjoiMjI1ZDYxYmMtNmZlNS00NmYzLTkzM2ItY2I5MGQ3NmFiYzA3IiwiYXVkIjoiM2ppaW41dWw0cHRjbDg2dWpqZ3NvYWo5dWkiLCJldmVudF9pZCI6IjAyOTRiMmNhLTYzZjYtNGFlZS05ZDdmLTI3OWM2YzQzZGM2YSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzE1OTU4MTMzLCJwaG9uZV9udW1iZXIiOiIrOTE5NzQxMTE2MDM1IiwiZXhwIjoxNzE1OTYxNzMzLCJpYXQiOjE3MTU5NTgxMzMsImp0aSI6ImMwZjczNGY2LTQyNDgtNGZhYS04YjlmLTNhNWI0NTU4OTE5NSJ9.dwINFYTFIRG2R4bOnECEcY52_SRxn-G-W_sme50OSdQo52xrofIrTmMTTzIStzdTTG3EcWY2jnM3Uu94hZ6BdnyJZsDJyIKxzlp2A7T8DVxC1CJ5l4ikSKVTHrINUtUM2RI85XWMmysnaX4ERqaDpVJBzf7mIvq4XnplIpMFYXgdMwZXIbvSBTqKGSbkLA5TNMR8YVzrFC3ydH2fHxk5Yc9obN39NJCRHtC2F6Q8Gm-rtAqXB4Puwfu0-l_B98ESeYEmxK5i-rxkJynEOTXSN9MOfHZvFK7kI1FtmpV72Jzm6s9FPVyfmvwJ86OdX2fiLqX59ikln6jfZSmfoq7aTQ";

    const requestOptions = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${idToken}`,
      },
      params: {
        bucket: "face-mementos",
        property_folder: "molecule_club_ifc",
        qt_folder: "qt_faces",
        camera_folder: "camera_1",
        filename: "Molecule_Cam1_1.jpg",
      },
    };

    try {
      const response = await axios.put(
        "https://eww5a3ve13.execute-api.ap-south-1.amazonaws.com/default/lambda-upload-image-trigger",
        formData,
        requestOptions
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
