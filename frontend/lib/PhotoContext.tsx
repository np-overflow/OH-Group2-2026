"use client";

import React, { createContext, useContext, useState } from "react";

interface PhotoContextType {
  editedPhotos: Blob[];
  setEditedPhotos: (photos: Blob[]) => void;
  sourceX: number;
  setSourceX: (x: number) => void;
  sourceY: number;
  setSourceY: (y: number) => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export function PhotoProvider({ children }: { children: React.ReactNode }) {
  const [editedPhotos, setEditedPhotos] = useState<Blob[]>([]);
  const [sourceX, setSourceX] = useState(0);
  const [sourceY, setSourceY] = useState(0);

  return (
    <PhotoContext.Provider
      value={{
        editedPhotos,
        setEditedPhotos,
        sourceX,
        setSourceX,
        sourceY,
        setSourceY,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhotoContext() {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error("usePhotoContext must be used within PhotoProvider");
  }
  return context;
}
