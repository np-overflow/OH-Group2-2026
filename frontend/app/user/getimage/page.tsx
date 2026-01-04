"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";

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
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-white gap-8 p-4">
      <h1 className="text-2xl font-bold">Your Photostrip</h1>
      
      <img
        src={imageUrl}
        alt="Photostrip"
        className="max-w-full max-h-[70vh] object-contain"
      />

      <button
        onClick={handleDownload}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        <Download size={20} />
        Download Image
      </button>
    </div>
  );
}
