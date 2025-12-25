"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type SessionResponse = {
	session_id: string;
	password: string;
	images: string[];
};

export default function CameraPage() {
	const router = useRouter();
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const [isStreamReady, setIsStreamReady] = useState(false);
	const [capturing, setCapturing] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const [photos, setPhotos] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	useEffect(() => {
		const enableCamera = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
				const video = videoRef.current;
				if (video) {
					video.srcObject = stream;
					await video.play();
					setIsStreamReady(true);
				}
			} catch (err) {
				setError("Unable to access the camera. Please allow camera permissions.");
			}
		};

		enableCamera();

		return () => {
			const tracks = (videoRef.current?.srcObject as MediaStream | null)?.getTracks();
			tracks?.forEach((track) => track.stop());
		};
	}, []);

	const captureFrame = () => {
		const video = videoRef.current;
		const canvas = canvasRef.current;
		if (!video || !canvas) return null;

		const width = video.videoWidth || 1280;
		const height = video.videoHeight || 720;
		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext("2d");
		if (!ctx) return null;

		ctx.drawImage(video, 0, 0, width, height);
		return canvas.toDataURL("image/png");
	};

	const startCaptureSequence = async () => {
		if (!isStreamReady || capturing) return;

		setError(null);
		setPhotos([]);
		setCapturing(true);

		const newPhotos: string[] = [];
		for (let i = 0; i < 3; i += 1) {
			for (let c = 5; c > 0; c -= 1) {
				setCountdown(c);
				await sleep(1000);
			}

			const photo = captureFrame();
			if (photo) newPhotos.push(photo);
		}

		setCountdown(0);
		setCapturing(false);
		setPhotos(newPhotos);

		if (newPhotos.length === 3) {
			await autoUpload(newPhotos);
		}
	};

	const autoUpload = async (shots: string[]) => {
		setIsUploading(true);
		setError(null);

		const formData = new FormData();
		await Promise.all(
			shots.map(async (photo, idx) => {
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
			const target = `/camera/share/${data.session_id}?password=${encodeURIComponent(data.password)}`;
			router.push(target);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unexpected error occurred.");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-800 px-4 py-6 text-white">
			<main className="mx-auto grid h-[84vh] max-h-[84vh] w-full max-w-6xl grid-cols-[1.7fr,1fr] gap-4 overflow-hidden rounded-3xl bg-white/10 p-4 shadow-2xl backdrop-blur">
				<header className="col-span-2 flex items-center justify-between gap-4">
					<div>
						<p className="text-[10px] uppercase tracking-[0.35em] text-blue-200">Capture</p>
						<h1 className="text-2xl font-semibold leading-tight">Three-shot booth</h1>
						<p className="text-sm text-blue-100">Three timed shots auto-upload and open the QR page.</p>
					</div>
					<Link
						href="/"
						className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/60"
					>
						Back home
					</Link>
				</header>

				<div className="relative h-full min-h-[52vh] overflow-hidden rounded-2xl border border-white/20 bg-black/50 shadow-inner">
					<video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
					{countdown > 0 && (
						<div className="absolute inset-0 flex items-center justify-center bg-black/60 text-7xl font-bold text-white">
							{countdown}
						</div>
					)}
					<div className="absolute right-4 top-4 rounded-full bg-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
						{capturing ? "Capturing" : isStreamReady ? "Camera ready" : "Waiting for camera"}
					</div>
					<div className="absolute left-4 bottom-4 space-y-1 rounded-lg bg-black/60 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-blue-100">
						<p>Countdown per shot: 5s</p>
						<p>Shots taken: {photos.length} / 3</p>
						{isUploading && <p>Uploading & generating QR...</p>}
					</div>
				</div>

				<div className="flex h-full flex-col gap-3 overflow-hidden">
					<div className="flex flex-col gap-3 rounded-2xl border border-white/20 bg-white/5 p-3">
						<p className="text-[10px] uppercase tracking-[0.3em] text-blue-200">Preview</p>
						<div className="flex flex-col gap-2">
							{[0, 1, 2].map((idx) => (
								<div
									key={`shot-${idx}`}
									className="overflow-hidden rounded-xl border border-white/10 bg-white/5"
									style={{ minHeight: "16vh" }}
								>
									{photos[idx] ? (
										<img src={photos[idx]} alt={`Shot ${idx + 1}`} className="h-full w-full object-cover" />
									) : (
										<div className="flex h-full items-center justify-center text-[12px] text-blue-100">Slot {idx + 1}</div>
									)}
								</div>
							))}
						</div>
					</div>

					<div className="mt-auto space-y-2 rounded-2xl border border-white/20 bg-white/5 p-3">
						<button
							type="button"
							disabled={!isStreamReady || capturing || isUploading}
							onClick={startCaptureSequence}
							className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{capturing ? "Capturing..." : isUploading ? "Uploading..." : "Start 3-shot capture"}
						</button>
						<p className="text-center text-[11px] text-blue-100">
							After the third shot we will upload automatically and open the QR download page.
						</p>
						{error && (
							<p className="rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-50">{error}</p>
						)}
					</div>
				</div>

				<canvas ref={canvasRef} className="hidden" />
			</main>
		</div>
	);
}
