"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

type SessionResponse = {
  session_id: string;
  password: string;
  images: string[];
};

type SessionResult = {
  sessionId: string;
  password: string;
  shareUrl: string;
  imageUrls: string[];
};

export default function UploadPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<SessionResult | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("capturedPhotos");
    if (!saved) {
      setError("No captured photos found. Please take photos first.");
      return;
    }
    try {
      const parsed = JSON.parse(saved) as string[];
      setPhotos(parsed);
    } catch {
      setError("Unable to read saved photos. Please retake.");
    }
  }, []);

  const uploadPhotos = async () => {
    if (photos.length !== 3) {
      setError("Capture three photos before uploading.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    await Promise.all(
      photos.map(async (photo, idx) => {
        const blob = await (await fetch(photo)).blob();
        formData.append("photos", new File([blob], `photo_${idx + 1}.png`, { type: "image/png" }));
      })
    );

    try {
      const response = await fetch("/api/sessions", { method: "POST", body: formData });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to process photos.");
      }

      const data = (await response.json()) as SessionResponse;
      const shareUrl = `${window.location.origin}/photos/${data.session_id}?password=${data.password}`;
      const imageUrls = data.images.map((url) =>
        url.includes("password=") ? url : `${url}?password=${encodeURIComponent(data.password)}`
      );

      setSession({
        sessionId: data.session_id,
        password: data.password,
        shareUrl,
        imageUrls,
      });
      sessionStorage.removeItem("capturedPhotos");
    } catch (err) {
      setSession(null);
      setError(err instanceof Error ? err.message : "Unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  const goBackToCamera = () => {
    router.push("/camera");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 px-4 py-6 text-white">
      <main className="mx-auto flex h-[92vh] w-full max-w-6xl flex-col gap-6 rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-blue-200">Upload & share</p>
            <h1 className="text-2xl font-semibold leading-tight">Send to backend</h1>
            <p className="text-sm text-blue-100">Review the three shots, then generate the QR and download links.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goBackToCamera}
              className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/60"
            >
              Retake photos
            </button>
            <Link
              href="/"
              className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/60"
            >
              Home
            </Link>
          </div>
        </header>

        <section className="grid h-full gap-4 lg:grid-cols-[1.4fr,1fr]">
          <div className="flex flex-col gap-4 rounded-2xl border border-white/20 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-blue-200">Preview</p>
                <p className="text-lg font-semibold">{photos.length} / 3 ready</p>
              </div>
              <button
                type="button"
                onClick={uploadPhotos}
                disabled={photos.length !== 3 || isUploading}
                className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploading ? "Uploading..." : "Upload & generate QR"}
              </button>
            </div>

            <div className="grid flex-1 grid-cols-3 gap-3">
              {[0, 1, 2].map((idx) => (
                <div
                  key={`shot-${idx}`}
                  className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5"
                >
                  {photos[idx] ? (
                    <img src={photos[idx]} alt={`Shot ${idx + 1}`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[11px] text-blue-100">Slot {idx + 1}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-white/20 bg-white/5 p-4">
            {!session && (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/25 bg-black/20 p-6 text-center text-sm text-blue-100">
                Upload to generate your password-protected gallery and QR code.
              </div>
            )}

            {session && (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-white/20 bg-black/30 p-4 shadow-inner">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-blue-200">Session ready</p>
                  <p className="text-lg font-semibold text-white">Session {session.sessionId}</p>
                  <p className="text-sm text-blue-100">
                    Password: <span className="font-semibold text-white">{session.password}</span>
                  </p>
                  <p className="mt-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-blue-100 break-all">
                    {session.shareUrl}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/photos/${session.sessionId}?password=${encodeURIComponent(session.password)}`}
                      className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-blue-100"
                    >
                      Open gallery
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-center rounded-2xl bg-white p-4 shadow-inner">
                  <QRCode value={session.shareUrl} size={200} />
                </div>
              </div>
            )}
          </div>
        </section>

        {session && session.imageUrls.length > 0 && (
          <section className="rounded-2xl border border-white/20 bg-white/5 p-4">
            <div className="flex items-center justify-between pb-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-blue-200">Downloads</p>
                <p className="text-sm text-blue-100">Processed images ready to save.</p>
              </div>
              <Link
                href={`/photos/${session.sessionId}?password=${encodeURIComponent(session.password)}`}
                className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/60"
              >
                View full page
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {session.imageUrls.map((url, idx) => (
                <div key={url} className="flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/10">
                  <img src={url} alt={`Processed shot ${idx + 1}`} className="aspect-[4/5] w-full object-cover" />
                  <div className="flex items-center justify-between px-4 py-3 text-sm">
                    <p className="font-semibold">Shot {idx + 1}</p>
                    <a
                      href={url}
                      download={`session-${session.sessionId}-shot-${idx + 1}.png`}
                      className="rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-slate-900 transition hover:bg-white"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
