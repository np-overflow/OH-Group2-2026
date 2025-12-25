"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";

export default function SharePage() {
  const params = useParams<{ sessionId: string }>();
  const searchParams = useSearchParams();

  const sessionId = params?.sessionId ?? "";
  const password = searchParams.get("password") ?? "";
  const photosUrl = password
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/photos/${sessionId}?password=${encodeURIComponent(password)}`
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 px-4 py-8 text-white">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-blue-200">Share</p>
            <h1 className="text-2xl font-semibold leading-tight">Scan to view photos</h1>
            <p className="text-sm text-blue-100">This QR opens the gallery with downloads for this session.</p>
          </div>
          <Link
            href="/camera"
            className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/60"
          >
            Back to camera
          </Link>
        </header>

        <section className="grid gap-6 rounded-2xl border border-white/20 bg-white/5 p-6 md:grid-cols-[1.2fr,1fr]">
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white p-6 text-center text-slate-900 shadow-inner">
            <QRCode value={photosUrl || "https://example.com"} size={220} />
            <p className="text-xs text-slate-600 break-all">
              {photosUrl || "Missing password parameter"}
            </p>
          </div>
          <div className="space-y-4 text-sm text-blue-100">
            <p>Session: <span className="font-semibold text-white">{sessionId}</span></p>
            <p>Password: <span className="font-semibold text-white">{password || "(missing)"}</span></p>
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.25em] text-blue-200">Direct link</p>
              {photosUrl ? (
                <Link
                  href={photosUrl.replace(typeof window !== "undefined" ? window.location.origin : "", "")}
                  className="inline-block rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 transition hover:bg-blue-100"
                >
                  Open gallery
                </Link>
              ) : (
                <p className="text-red-100">Password missing from URL.</p>
              )}
              <p className="text-[12px] text-blue-200">
                Anyone with this QR and password can view and download the three processed photos.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
