"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setError(null);
    setImageFile(file);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imageFile) {
      setError("Select an image before submitting.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to remove background.");
      }

      const blob = await response.blob();
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setResultUrl(null);
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setIsProcessing(false);
    }
  };

  
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold">Background Remover Playground</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            Upload an image to call the FastAPI <code>/remove-bg</code> route via the Next.js
            rewrite. The processed PNG will render below when the request succeeds.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
          <div className="flex flex-col gap-2">
            <label htmlFor="image" className="text-sm font-medium uppercase tracking-wide">
              Choose an image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="rounded-md border border-dashed border-zinc-400 px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white dark:file:bg-zinc-100 dark:file:text-black"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full rounded-md bg-zinc-900 py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
          >
            {isProcessing ? "Removing background..." : "Send to FastAPI"}
          </button>

          {error && (
            <p className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-900 dark:bg-red-900/30 dark:text-red-200">
              {error}
            </p>
          )}
        </form>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Original</h2>
            <div className="flex min-h-60 items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
              {previewUrl ? (
                <img src={previewUrl} alt="Original upload preview" className="max-h-72 object-contain" />
              ) : (
                <p className="text-sm text-zinc-500">No image selected.</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Result</h2>
            <div className="flex min-h-60 items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
              {resultUrl ? (
                <img src={resultUrl} alt="Background removed result" className="max-h-72 object-contain" />
              ) : (
                <p className="text-sm text-zinc-500">
                  {isProcessing ? "Processing image..." : "Run the request to preview the output."}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
