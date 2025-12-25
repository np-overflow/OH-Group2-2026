"use client";
import React, { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db, storage } from "@/lib/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const UploadFilePage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [status, setStatus] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: any) => {
    if (fileInput.current?.files![0]) {
      const file = fileInput.current?.files![0];
      const objectURL = URL.createObjectURL(file);
      setBgUrl(objectURL);
    }
  };

  const confirmFileChange = async (e: any) => {
    const file = fileInput.current!.files![0];
    if (!file) return;

    if (!sessionId) {
      alert(
        "Error: No Session ID found. Please scan the QR Code again, buddy!"
      );
      return;
    }

    try {
      //Create a reference to where the file will be saved
      const storageRef = ref(storage, `custom-bg/${sessionId}/${file.name}`);
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);

      //get the public URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log(downloadURL);
      setBgUrl(downloadURL);

      setStatus(true);

      //Update the database triggering admin panel upload page
      await setDoc(doc(db, "custom-bg", sessionId), {
        imageUrl: downloadURL,
      });
    } catch (error) {
      console.error("Upload failed: " + error);
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
            src={bgUrl ?? "images/not-uploaded.png"}
            className="aspect-7/5 object-cover w-[300px] max-w-full"
          ></img>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={confirmFileChange}
          className="p-4 bg-[#2C7AFC] rounded font-semibold text-white "
        >
          Confirm Background
        </button>
      </div>
      {status ? (
        <p className="text-center mt-4">
          Your file has been received! <br></br> Check the photobooth screen{" "}
        </p>
      ) : null}
    </div>
  );
};

export default UploadFilePage;
