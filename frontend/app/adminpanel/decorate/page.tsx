"use client";

import { usePhotoContext } from "@/lib/PhotoContext";
import LoadingPage from "@/components/LoadingPage";
import DecoratePage from "./DecoratePage";

export default function DecorateRoute() {
  const { editedPhotos, sourceX, sourceY } = usePhotoContext();

  if (editedPhotos.length !== 3) {
    return <LoadingPage />;
  }

  return (
    <DecoratePage
      imageBlobs={editedPhotos}
      sourceX={sourceX}
      sourceY={sourceY}
    />
  );
}
