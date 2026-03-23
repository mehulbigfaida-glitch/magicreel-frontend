import { useEffect, useRef, useState } from "react";

type Status = "idle" | "queued" | "running" | "completed" | "failed";

const API_BASE = "http://127.0.0.1:5001";

export function useMagicReel() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const pollRef = useRef<number | null>(null);

  const generate = async (heroImagePath: string) => {
    setStatus("queued");

    const res = await fetch(`${API_BASE}/api/magicreel/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroImagePath }),
    });

    if (!res.ok) {
      throw new Error("Generate request failed");
    }

    const data = await res.json();
    setJobId(data.jobId);
  };

  useEffect(() => {
    if (!jobId) return;

    pollRef.current = window.setInterval(async () => {
      const res = await fetch(
        `${API_BASE}/api/magicreel/status/${jobId}`
      );
      const data = await res.json();

      setStatus(data.status as Status);

      if (data.status === "completed") {
        setVideoUrl(data.result.videoUrl);
        clearInterval(pollRef.current!);
      }

      if (data.status === "failed") {
        clearInterval(pollRef.current!);
      }
    }, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [jobId]);

  return { generate, status, videoUrl };
}
