"use client";
import React, { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const UploadFilePage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const sessionPassword = searchParams.get("password");
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [status, setStatus] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: any) => {
    if (fileInput.current?.files![0]) {
      const file = fileInput.current?.files![0];
      const objectURL = URL.createObjectURL(file);
      setBgUrl(objectURL);
      setError(null);
    }
  };

  const confirmFileChange = async (e: any) => {
    const file = fileInput.current!.files![0];
    if (!file) return;

    if (!sessionId) {
      setError(
        "Error: No Session ID found. Please scan the QR Code again, buddy!"
      );
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/upload-background/${sessionId}`, {
        method: "POST",
        headers: {
          "X-Session-Password": sessionPassword || "",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload background");
      }

      setStatus(true);
      setError(null);
    } catch (error) {
      console.error("Upload failed: " + error);
      setError(error instanceof Error ? error.message : "Upload failed");
      setStatus(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="mt-4 text-2xl text-center font-bold mb-20">
        Upload Background
      </h1>
      <div className="p-4 border-1 rounded">
        <label className="">Choose an image</label>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file:rounded mt-2  file:bg-[#2C7AFC] file:text-white file:p-2 file:mr-5"
        ></input>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl mb-4">Background preview</h2>
        <div className="border-1 rounded p-4 w-full flex justify-center">
          <img
            src={bgUrl ?? "/images/not-uploaded.png"}
            className="aspect-7/5 object-cover w-[300px] max-w-full"
          ></img>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={confirmFileChange}
          disabled={isUploading || !bgUrl}
          className="p-4 bg-[#2C7AFC] rounded font-semibold text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading..." : "Confirm Background"}
        </button>
      </div>
      {status ? (
        <p className="text-center mt-4 text-green-600 font-semibold">
          Your file has been received! <br></br> Check the photobooth screen{" "}
        </p>
      ) : null}
      {error ? (
        <p className="text-center mt-4 text-red-600 font-semibold">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default UploadFilePage;
