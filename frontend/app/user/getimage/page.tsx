"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import Image from "next/image";

export default function GetImagePage() {
  const searchParams = useSearchParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const encoded = searchParams.get("image");
    if (encoded) {
      try {
        const decoded = atob(encoded);
        setImageUrl(decoded);
      } catch (error) {
        console.error("Failed to decode image URL:", error);
        setLoading(false);
      }
    }
    setLoading(false);
  }, [searchParams]);

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "photostrip.png";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-lg text-gray-600">Image not found</p>
        <a href="/" className="text-blue-500 underline">
          Go back
        </a>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-white p-4 gap-4">
      <h1 className="text-2xl font-bold shrink-0">Your Photostrip</h1>
      
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shrink-0"
      >
        <Download size={20} />
        Download Image
      </button>
      <div className="flex-1 items-center justify-center min-h-0">
        <Image
          src={imageUrl}
          alt="Photostrip"
          width={300}
          height={600}
          className="max-w-full max-h-full object-contain"
        />
      </div>

    </div>
  );
}
