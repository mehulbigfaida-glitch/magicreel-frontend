import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./carouselReelOutput.css";

type Scene = { poseId: string; imageUrl?: string };

const labelForPose = (poseId: string) => {
  const id = poseId.toLowerCase();
  if (id === "front" || id === "hero") return "FRONT";
  if (id === "back") return "BACK";
  const match = id.match(/^pose_(\d+)$/);
  return match ? `POSE ${match[1]}` : id.replace(/_/g, " ").toUpperCase();
};

export default function CarouselReelOutputPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as {
    videoUrl?: string;
    scenes?: Scene[];
    lookbookId?: string;
  };
  const params = new URLSearchParams(location.search);
  const videoUrl = state.videoUrl || params.get("videoUrl") || "";
  const scenes = state.scenes || [];
  const [selectedScene, setSelectedScene] = useState(0);
  const [copying, setCopying] = useState(false);

  const selectedImage = useMemo(() => scenes[selectedScene]?.imageUrl, [scenes, selectedScene]);

  const handleDownload = async () => {
    if (!videoUrl) return;
    try {
      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "magicreel-carousel-reel.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Carousel Reel download error", error);
      alert("Download failed");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopying(true);
      window.setTimeout(() => setCopying(false), 1600);
    } catch (error) {
      console.error("Carousel Reel copy error", error);
      alert("Unable to copy link");
    }
  };

  const handlePublish = () => {
    if (!videoUrl) return;
    navigate(`/publish?assetUrl=${encodeURIComponent(videoUrl)}&type=reel${selectedImage ? `&heroImageUrl=${encodeURIComponent(selectedImage)}` : ""}`);
  };

  if (!videoUrl) {
    return (
      <div className="carousel-reel-empty">
        <div>
          <h1>Carousel Reel not found</h1>
          <button onClick={() => navigate(-1)}>Back to Lookbook</button>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-reel-page">
      <div className="carousel-reel-orb carousel-reel-orb-one" />
      <div className="carousel-reel-orb carousel-reel-orb-two" />

      <main className="carousel-reel-shell">
        <div className="carousel-reel-topline">
          <button className="carousel-reel-back" onClick={() => navigate(-1)}>← <span>Back to Lookbook</span></button>
          <div className="carousel-reel-brand">MAGIC<span>REEL</span></div>
          <div className="carousel-reel-quality"><strong>1080p</strong><b>HD</b></div>
        </div>

        <section className="carousel-reel-hero">
          <aside className="carousel-reel-left">
            <div className="carousel-reel-kicker">MAGICREEL AI STUDIO</div>
            <h1>Carousel Reel</h1>
            <p className="carousel-reel-description">A cinematic showcase of your collection with smooth transitions and elegant motion effects.</p>

            <div className="carousel-reel-scenes">
              {scenes.map((scene, index) => (
                <button
                  key={`${scene.poseId}-${index}`}
                  className={`carousel-reel-scene ${selectedScene === index ? "selected" : ""}`}
                  onClick={() => setSelectedScene(index)}
                >
                  {scene.imageUrl ? <img src={scene.imageUrl} alt={labelForPose(scene.poseId)} /> : <span>{index + 1}</span>}
                </button>
              ))}
            </div>

            <div className="carousel-reel-meta">
              <span>{scenes.length || 6} scenes</span><i>•</i><span>~11 seconds</span><i>•</i><span>1080 × 1920</span>
            </div>
          </aside>

          <section className="carousel-reel-player-column">
            <div className="carousel-reel-player-frame">
              <video src={videoUrl} controls playsInline autoPlay muted poster={selectedImage} />
              <div className="carousel-reel-player-badge"><span>1080p</span><b>HD</b></div>
            </div>
            <div className="carousel-reel-arrows">
              <button onClick={() => setSelectedScene((selectedScene - 1 + Math.max(scenes.length, 1)) % Math.max(scenes.length, 1))}>‹</button>
              <button onClick={() => setSelectedScene((selectedScene + 1) % Math.max(scenes.length, 1))}>›</button>
            </div>
          </section>

          <aside className="carousel-reel-right">
            <h2>From Every Angle<br />to Every Audience</h2>
            <p className="carousel-reel-right-intro">Turn your product into a story.</p>
            <div className="carousel-reel-benefit"><span>◉</span><div><strong>Cinematic Transitions</strong><p>Smooth zooms, pans and elegant moves for a premium look.</p></div></div>
            <div className="carousel-reel-benefit"><span>✦</span><div><strong>Showcase Every Detail</strong><p>Highlight fit, fabric and design from multiple angles.</p></div></div>
            <div className="carousel-reel-benefit"><span>⌯</span><div><strong>Ready to Share</strong><p>Perfect for social media, ads and marketplaces.</p></div></div>
            <div className="carousel-reel-benefit"><span>♡</span><div><strong>Made for Fashion Brands</strong><p>Professional reels in seconds with AI.</p></div></div>
            <div className="carousel-reel-signoff">Showcase Style<br />Create Impact</div>
          </aside>
        </section>

        <section className="carousel-reel-actions">
          <button className="carousel-reel-primary" onClick={handleDownload}>⇩ <span>Download Video</span></button>
          <button className="carousel-reel-secondary" onClick={handleCopyLink}>⌘ <span>{copying ? "Copied ✓" : "Copy Link"}</span></button>
          <button className="carousel-reel-secondary" onClick={handlePublish}>♧ <span>Publish</span></button>
        </section>

        <div className="carousel-reel-footer">Your Fashion. A Bigger Audience. ✨</div>
      </main>
    </div>
  );
}
