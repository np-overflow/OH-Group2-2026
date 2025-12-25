"use client";
import ContinueButton from "@/components/ContinueButton";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { ref } from "firebase/storage";
import { useRouter } from "next/navigation";

const UploadPage = () => {
  let router = useRouter();
  const [continueAvailable, setContinueAvailable] = useState(false);
  const [bgImage, setBgImage] = useState(null);
  const [sessionId, setSessionId] = useState<string | null>("");
  const mobileUrl = `https://compote.slate.com/images/22ce4663-4205-4345-8489-bc914da1f272.jpeg?crop=1560%2C1040%2Cx0%2Cy0`;
  // Edit this when hosting

  useEffect(() => {
    let newSessionId = localStorage.getItem("sessionId");
    setSessionId(newSessionId);

    if (newSessionId) {
      const unsub = onSnapshot(
        doc(db, "custom-bg", newSessionId),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data.imageUrl) {
              console.log("Image received!", data.imageUrl);
              setBgImage(data.imageUrl);
              setContinueAvailable(true);
            }
          }
        }
      );
    }
  }, []);

  return (
    <div className="h-screen font-geist">
      <div className="h-full flex flex-col gap-24 items-center p-20">
        <h1 className="font-bold text-4xl text-center ">Upload Background</h1>

        <div className="w-full flex justify-center items-center gap-40 ">
          <div className="flex flex-col justify-center items-center overflow-hidden gap-4">
            <h3 className="text-xl  ">Scan to upload:</h3>
            <div className="border-2 border-black rounded-xl p-4">
              {sessionId && <QRCode value={mobileUrl} size={300} />}
            </div>
          </div>
          <img
            className="aspect-7/5 object-cover w-[600px] h-fit flex-none rounded border-1"
            src={bgImage ?? "/images/not-uploaded.png"}
          ></img>
        </div>
      </div>
      <ContinueButton
        onClick={() => {router.push("/adminpanel/livephoto")}}
        title="Continue"
        isAvailable={continueAvailable}
      />
    </div>
  );
};

export default UploadPage;
