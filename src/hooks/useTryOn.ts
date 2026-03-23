import { useEffect, useRef, useState } from "react";
import { pollTryOn, startTryOn } from "../api/tryon";
import type { TryOnJob } from "../api/tryon";

/* -------------------------------------------
   Status → Human-friendly label
------------------------------------------- */
export function getTryOnLabel(status?: TryOnJob["status"]) {
  switch (status) {
    case "created":
      return "Uploading garment…";
    case "fashn_running":
      return "Dressing model…";
    case "post_processing":
      return "Shaping fit…";
    case "completed":
      return "Look ready ✨";
    case "failed":
      return "Something went wrong";
    default:
      return "Preparing…";
  }
}

/* -------------------------------------------
   Try-On Hook
------------------------------------------- */
export function useTryOn() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<TryOnJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollRef = useRef<number | null>(null);

  /* ---------- Start Try-On ---------- */
  async function runTryOn(garmentImageUrl: string) {
    setLoading(true);
    setError(null);
    setJob(null);
    setJobId(null);

    try {
      const { jobId } = await startTryOn(garmentImageUrl);
      setJobId(jobId);
    } catch (e: any) {
      setError(e.message || "Failed to start try-on");
      setLoading(false);
    }
  }

  /* ---------- Polling ---------- */
  useEffect(() => {
    if (!jobId) return;

    pollRef.current = window.setInterval(async () => {
      try {
        const latestJob = await pollTryOn(jobId);
        setJob(latestJob);

        if (
          latestJob.status === "completed" ||
          latestJob.status === "failed"
        ) {
          setLoading(false);
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      } catch (e: any) {
        setError(e.message || "Polling failed");
        setLoading(false);
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      }
    }, 2000);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [jobId]);

  return {
    runTryOn,
    job,
    loading,
    error,
    statusLabel: getTryOnLabel(job?.status),
  };
}
