import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../../config/api";
import CarouselReelOutputPage from "./CarouselReelOutputPage";

type Pose = { poseId: string; imageUrl?: string };
const POLL_MS = 4000;
const MAX_POLLS = 120;

export default function CarouselReelOutputRoutePage() {
  const { id } = useParams();
  const [videoUrl, setVideoUrl] = useState("");
  const [scenes, setScenes] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pollRef = useRef(0);

  useEffect(() => {
    if (!id) { setLoading(false); setError("Lookbook not found"); return; }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    pollRef.current = 0;

    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const statusRes = await fetch(`${API_BASE}/api/p2m/lookbook-v1/status/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await statusRes.json();
        if (cancelled) return;
        if (!statusRes.ok) throw new Error(data?.error || "Failed to load Lookbook");
        const nextScenes: Pose[] = (data?.poses || [])
          .map((p: any) => ({ poseId: String(p.poseId || "").toLowerCase(), imageUrl: p.imageUrl || p.resultImageUrl }))
          .filter((p: Pose) => p.imageUrl);
        setScenes(nextScenes);
        if (data?.reelVideoUrl || data?.videoUrl) {
          setVideoUrl(data.reelVideoUrl || data.videoUrl);
          setLoading(false);
          return;
        }
        if (data?.status === "failed") throw new Error("Lookbook generation failed");
        pollRef.current += 1;
        if (pollRef.current >= MAX_POLLS) throw new Error("Timed out loading Lookbook");
        timer = setTimeout(load, POLL_MS);
      } catch (e: any) {
        if (!cancelled) { setError(e?.message || "Unable to load Lookbook"); setLoading(false); }
      }
    };
    load();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [id]);

  const readyScenes = useMemo(() => scenes.slice(0, 6), [scenes]);
  if (loading) return <div className="carousel-reel-empty"><div><h1>Creating Carousel Reel…</h1><p>Please keep this tab open.</p></div></div>;
  if (error || !videoUrl) return <div className="carousel-reel-empty"><div><h1>{error || "Carousel Reel not found"}</h1><p>Please return to the Lookbook and try again.</p></div></div>;
  return <CarouselReelOutputPage videoUrl={videoUrl} scenes={readyScenes} lookbookId={id} />;
}
