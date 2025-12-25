"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50 text-zinc-900 flex items-center justify-center px-4">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 rounded-3xl bg-white/90 p-10 shadow-2xl backdrop-blur">
        <section className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-500">Photo Booth</p>
          <h1 className="text-4xl font-semibold leading-tight text-zinc-900">
            Capture three photos, remove the background, and share them instantly.
          </h1>
          <p className="max-w-3xl text-lg text-zinc-600">
            We will guide you through a quick three-shot capture flow. After processing, we create a
            password-protected link and QR code so your guests can safely download their pictures.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/camera"
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Go to camera
            </Link>
            <a
              href="#how-it-works"
              className="rounded-full border border-blue-200 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-300"
            >
              How it works
            </a>
          </div>
        </section>

        <section
          id="how-it-works"
          className="grid gap-6 rounded-2xl border border-zinc-200 bg-gradient-to-r from-blue-50 via-white to-blue-50 p-8 md:grid-cols-3"
        >
          {["Capture", "Process", "Share"].map((title, idx) => (
            <div key={title} className="space-y-2 rounded-xl bg-white/80 p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                Step {idx + 1}
              </div>
              <div className="text-lg font-semibold text-zinc-900">{title}</div>
              <p className="text-sm text-zinc-600">
                {idx === 0 && "Open the camera and we will guide a 3-shot countdown with your webcam."}
                {idx === 1 && "We remove each background and store the set securely with a session password."}
                {idx === 2 && "Share the QR code; the link lists the three photos with download buttons."}
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
