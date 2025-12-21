"use client";
import ContinueButton from "@/components/ContinueButton";
import React, { useState } from "react";

const UploadPage = () => {
  return (
    <div className="h-screen font-geist">
      <div className="h-full flex flex-col gap-24 items-center p-20">
        <h1 className="font-bold text-4xl text-center ">Upload Background</h1>

        <div className="w-full flex justify-center items-center gap-40 ">
          <div className="flex flex-col justify-center items-center overflow-hidden gap-4">
            <h3 className="text-xl  ">Scan to upload:</h3>
            <div className="border-2 border-black rounded-xl p-2">
              <img className="max-w-90" src="/images/test-qr.png"></img>
            </div>
          </div>
          <img
            className="aspect-7/5 object-cover w-[600px] h-fit flex-none"
            src="/images/not-uploaded.png"
          ></img>
        </div>
      </div>
      <ContinueButton title="Continue" /> /* incomplete logic, need to wait for back-end support */
      
    </div>
  );
};

export default UploadPage;
