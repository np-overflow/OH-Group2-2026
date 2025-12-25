"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type ImageListResponse = {
  images: string[];
};

export default function SessionPhotosPage() {
  const params = useParams<{ sessionId: string }>();
  const searchParams = useSearchParams();

  const sessionId = params?.sessionId ?? "";
  const password = searchParams.get("password") ?? "";

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      if (!sessionId) return;
      if (!password) {
        setError("Password is required to view these photos.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/sessions/${sessionId}/images?password=${encodeURIComponent(password)}`
        );
        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Unable to fetch photos.");
        }

        const data = (await response.json()) as ImageListResponse;
        const normalized = data.images.map((url) =>
          url.includes("password=") ? url : `${url}?password=${encodeURIComponent(password)}`
        );
        setImages(normalized);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [sessionId, password]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-blue-900 px-4 py-10 text-white">
      <main className="mx-auto w-full max-w-6xl space-y-8 rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-blue-200">Your photos</p>
            <h1 className="text-3xl font-semibold">Session {sessionId}</h1>
            <p className="text-sm text-blue-100">
              Download all three processed shots. Keep the password safe if you share this link.
            </p>
          </div>
          <Link
            href="/camera"
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
          >
            Back to camera
          </Link>
        </div>

        {loading && <p className="text-sm text-blue-100">Loading photos...</p>}
        {error && (
          <p className="rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-50">{error}</p>
        )}

        {!loading && !error && (
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-blue-200">Downloads</p>
                <p className="text-sm text-blue-100">Tap any card to preview or save.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {images.map((url, idx) => (
                <div
                  key={url}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg transition hover:-translate-y-1 hover:border-white/30"
                >
                  <div className="relative">
                    <img
                      src={url}
                      alt={`Session photo ${idx + 1}`}
                      className="aspect-[4/5] w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-white">Shot {idx + 1}</p>
                      <p className="text-[12px] text-blue-100">PNG • Background removed</p>
                    </div>
                    <a
                      href={url}
                      download={`session-${sessionId}-shot-${idx + 1}.png`}
                      className="rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-slate-900 transition hover:bg-white"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
