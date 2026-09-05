import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../../config/api";
import "./carouselReelOutput.css";

type Scene = { poseId: string; imageUrl?: string };
const labelForPose = (poseId: string) => { const id = poseId.toLowerCase(); if (id === "front" || id === "hero") return "FRONT"; if (id === "back") return "BACK"; const match = id.match(/^pose_(\d+)$/); return match ? `POSE ${match[1]}` : id.replace(/_/g, " ").toUpperCase(); };

export default function ReelOutputPage() {
  const { renderId } = useParams();
  const navigate = useNavigate();
  const [videoUrl,setVideoUrl]=useState("");
  const [heroImageUrl,setHeroImageUrl]=useState("");
  const [scenes,setScenes]=useState<Scene[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [selectedScene,setSelectedScene]=useState(0);
  const [copying,setCopying]=useState(false);

  useEffect(()=>{
    let cancelled=false;
    const load=async()=>{
      try{
        const reelRes=await fetch(`${API_BASE}/api/p2m/reel/${renderId}`);
        const reel=await reelRes.json();
        if(!reelRes.ok) throw new Error(reel?.error||"Reel not found");
        if(cancelled)return;
        setVideoUrl(reel.reelVideoUrl||"");
        setHeroImageUrl(reel.heroImageUrl||"");
        if(reel.lookbookId){
          const token=localStorage.getItem("token");
          const lookbookRes=await fetch(`${API_BASE}/api/p2m/lookbook-v1/status/${reel.lookbookId}`,{headers:{Authorization:`Bearer ${token}`}});
          if(lookbookRes.ok){
            const lookbook=await lookbookRes.json();
            const nextScenes=(lookbook?.poses||[]).map((p:any)=>({poseId:String(p.poseId||"").toLowerCase(),imageUrl:p.imageUrl||p.resultImageUrl})).filter((p:Scene)=>p.imageUrl).slice(0,6);
            if(!cancelled)setScenes(nextScenes);
          }
        }
      }catch(e:any){if(!cancelled)setError(e?.message||"Unable to load Reel");}
      finally{if(!cancelled)setLoading(false);}
    };
    load();
    return()=>{cancelled=true;};
  },[renderId]);

  const selectedImage=useMemo(()=>scenes[selectedScene]?.imageUrl||heroImageUrl,[scenes,selectedScene,heroImageUrl]);
  const handleDownload=async()=>{try{const r=await fetch(videoUrl);if(!r.ok)throw new Error();const b=await r.blob();const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="magicreel-carousel-reel.mp4";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(u);}catch(e){console.error(e);alert("Download failed");}};
  const handleCopy=async()=>{try{await navigator.clipboard.writeText(window.location.href);setCopying(true);setTimeout(()=>setCopying(false),1600);}catch(e){console.error(e);alert("Unable to copy link");}};
  const handlePublish=()=>{if(videoUrl)navigate(`/publish?assetUrl=${encodeURIComponent(videoUrl)}&type=reel&heroImageUrl=${encodeURIComponent(heroImageUrl)}`);};

  if(loading)return <div className="carousel-reel-empty"><div><h1>Loading Carousel Reel…</h1><p>Preparing your cinematic showcase.</p></div></div>;
  if(error||!videoUrl)return <div className="carousel-reel-empty"><div><h1>{error||"Carousel Reel not found"}</h1><button onClick={()=>navigate(-1)}>Back to Lookbook</button></div></div>;

  return <div className="carousel-reel-page"><div className="carousel-reel-orb carousel-reel-orb-one"/><div className="carousel-reel-orb carousel-reel-orb-two"/><main className="carousel-reel-shell">
    <div className="carousel-reel-topline"><button className="carousel-reel-back" onClick={()=>navigate(-1)}>← <span>Back to Lookbook</span></button><div className="carousel-reel-brand">Magic<span>Reel</span></div><div className="carousel-reel-quality"><strong>1080p</strong><b>HD</b></div></div>
    <section className="carousel-reel-hero">
      <aside className="carousel-reel-left"><div className="carousel-reel-kicker">MAGICREEL AI STUDIO</div><h1>Carousel Reel</h1><p className="carousel-reel-description">A cinematic showcase of your collection with the same elegant motion and transitions as the proven 15-second Reel.</p><div className="carousel-reel-scenes">{scenes.slice(0,6).map((scene,index)=><button key={`${scene.poseId}-${index}`} className={`carousel-reel-scene ${selectedScene===index?"selected":""}`} onClick={()=>setSelectedScene(index)}><img src={scene.imageUrl||""} alt={labelForPose(scene.poseId)}/></button>)}</div><div className="carousel-reel-meta"><span>{scenes.length||6} scenes</span><i>•</i><span>~15 seconds</span><i>•</i><span>1080 × 1440</span></div></aside>
      <section className="carousel-reel-player-column"><div className="carousel-reel-player-frame"><video src={videoUrl} controls playsInline autoPlay muted poster={selectedImage}/><div className="carousel-reel-player-badge"><span>1080p</span><b>HD</b></div></div></section>
      <aside className="carousel-reel-right"><h2>From Every Angle<br/>to Every Audience</h2><p className="carousel-reel-right-intro">Turn your product into a story.</p><div className="carousel-reel-benefit"><span>◉</span><div><strong>Cinematic Camera Motion</strong><p>Subtle vertical scans, gentle push-ins and directional movement keep the garment at the centre.</p></div></div><div className="carousel-reel-benefit"><span>✦</span><div><strong>Showcase Every Detail</strong><p>Reveal the garment from bottom to top and top to bottom so fabric, fit and finishing can be experienced.</p></div></div><div className="carousel-reel-benefit"><span>⌯</span><div><strong>Ready to Share</strong><p>Designed for social media, ads and marketplaces.</p></div></div><div className="carousel-reel-benefit"><span>♡</span><div><strong>Made for Fashion Brands</strong><p>Professional reels in seconds with AI.</p></div></div><div className="carousel-reel-signoff">Showcase Style<br/>Create Impact</div></aside>
    </section>
    <section className="carousel-reel-actions"><button className="carousel-reel-primary" onClick={handleDownload}>⇩ <span>Download Video</span></button><button className="carousel-reel-secondary" onClick={handleCopy}>⌘ <span>{copying?"Copied ✓":"Copy Link"}</span></button><button className="carousel-reel-secondary" onClick={handlePublish}>♧ <span>Publish</span></button></section><div className="carousel-reel-footer">Your Fashion. A Bigger Audience. ✨</div>
  </main></div>;
}
