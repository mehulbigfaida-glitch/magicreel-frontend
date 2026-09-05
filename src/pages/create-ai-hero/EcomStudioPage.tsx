import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ecomStudio.css";
import { API_BASE } from "../../config/api";
import LookbookHeroPickerModal from "./LookbookHeroPickerModal";

type AspectRatio = "2:3" | "3:4" | "4:5" | "1:1";
const ASPECT_RATIOS: AspectRatio[] = ["2:3", "3:4", "4:5", "1:1"];

export default function EcomStudioPage(){
  const location=useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const incomingFront=location.state?.heroImageUrl || params.get("hero") || "";
  const incomingBack=location.state?.backHeroImageUrl || params.get("back") || "";
  const incomingGender=location.state?.gender || params.get("gender") || "";
  const incomingCategory=location.state?.category || params.get("category") || "";
  const [selectedGender,setSelectedGender]=useState(incomingGender);
  const [selectedCategory,setSelectedCategory]=useState(incomingCategory);
  const [frontHero,setFrontHero]=useState(incomingFront);
  const [backHero,setBackHero]=useState(incomingBack);
  const [aspectRatio,setAspectRatio]=useState<AspectRatio>(()=>{
    const value=params.get("ar") as AspectRatio | null;
    return value && ASPECT_RATIOS.includes(value) ? value : "2:3";
  });

  const LOOKBOOK_WORLDS=[
    {id:"ecom-clean",name:"Ecom Clean",description:"Seamless white studio, colour-accurate lighting, clean product framing and minimal styling."},
    {id:"designer-marketplace",name:"Designer Marketplace",description:"Refined designer-commerce presentation with product-focused poses."},
    {id:"ethnic-luxe",name:"Ethnic Luxe",description:"Jewellery, accessories, elegant styling and premium Indian fashion presentation."},
    {id:"modern-minimal",name:"Modern Minimal",description:"Clean backgrounds, restrained styling and strong garment focus."},
    {id:"editorial-couture",name:"Editorial Couture",description:"Expressive poses, sophisticated compositions and fashion-magazine energy."},
    {id:"bridal-couture",name:"Bridal Couture",description:"Grand couture presentation with luxurious styling and elaborate bridal jewellery."}
  ];
  const [selectedWorld,setSelectedWorld]=useState("ecom-clean");
  const [loading,setLoading]=useState(false);
  const [loadingMessage,setLoadingMessage]=useState("");
  const [elapsedTime,setElapsedTime]=useState(0);
  const [heroPickerOpen,setHeroPickerOpen]=useState(false);
  const [heroPickerTarget,setHeroPickerTarget]=useState<"front"|"back">("front");
  const fromHero=useMemo(()=>!!incomingFront,[incomingFront]);

  async function handleGenerate(){
    if(!frontHero){alert("Please select a Front Hero from your Assets.");return;}
    let timer:ReturnType<typeof setInterval>|undefined;
    try{
      setLoading(true);setElapsedTime(0);setLoadingMessage("✨ Understanding Garment...");
      const start=Date.now();
      timer=setInterval(()=>{const seconds=Math.floor((Date.now()-start)/1000);setElapsedTime(seconds);if(seconds<=30)setLoadingMessage("✨ Understanding Garment...");else if(seconds<=60)setLoadingMessage("🎨 Creating Commercial Lookbook Poses...");else if(seconds<=90)setLoadingMessage("☁️ Processing High-Resolution Images...");else setLoadingMessage("✅ Finalizing Lookbook...");},1000);
      const token=localStorage.getItem("token");
      const res=await fetch(`${API_BASE}/api/p2m/lookbook-v1/generate`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({heroImageUrl:frontHero,backHeroImageUrl:backHero||undefined,lookbookWorld:selectedWorld,gender:selectedGender||"unisex",category:selectedCategory||"shirt",aspectRatio})});
      const data=await res.json();
      if(!res.ok){console.error(data);alert(data.error||"Lookbook generation failed");return;}
      if(timer)clearInterval(timer);
      navigate(`/pack/ecom/v1/output/${data.runId}`);
    }catch(err){console.error("Ecom Lookbook generation error",err);if(timer)clearInterval(timer);alert("Generation failed");}
    finally{setLoading(false);}
  }

  return <>
    <div className="ecom-page"><div className="ecom-container">
      <div className="mini-top">✦ MAGICREEL AI STUDIO ✦</div>
      <h1>Lookbook Studio</h1>
      <p className="subtitle">Create premium fashion lookbooks with AI-generated commercial fashion poses.</p>
      <div className="hero-grid">
        <div className="hero-card"><div className="card-title">1. FRONT HERO IMAGE</div>{fromHero&&<div className="linked-badge">✓ Linked from Hero</div>}<div className="preview-large" onClick={()=>{setHeroPickerTarget("front");setHeroPickerOpen(true);}}>{frontHero?<img src={frontHero} alt=""/>:<div className="upload-center"><div className="upload-circle">↑</div><div>Upload front hero image</div><div className="upload-text">Required</div></div>}</div></div>
        <div className="hero-card"><div className="card-title">{backHero?"2. BACK HERO IMAGE ✓":"2. BACK HERO IMAGE (OPTIONAL)"}</div><div className="preview-large" onClick={()=>{setHeroPickerTarget("back");setHeroPickerOpen(true);}}>{backHero?<img src={backHero} alt=""/>:<div className="upload-center"><div className="upload-circle">↑</div><div>Upload back image</div><div className="upload-text">Recommended</div></div>}</div></div>
      </div>
      <div className="section-title">CHOOSE YOUR LOOKBOOK WORLD</div>
      <div className="world-grid">{LOOKBOOK_WORLDS.map(world=><div key={world.id} className={`world-card ${selectedWorld===world.id?"selected":""}`} onClick={()=>!loading&&setSelectedWorld(world.id)}><div className="world-content"><h3>{world.name}</h3><p>{world.description}</p></div></div>)}</div>
      <div className="section-title" style={{marginTop:24}}>CHOOSE OUTPUT ASPECT RATIO</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,maxWidth:520,margin:"0 auto 22px"}}>{ASPECT_RATIOS.map(ratio=><button key={ratio} type="button" disabled={loading} onClick={()=>setAspectRatio(ratio)} style={{padding:"12px 10px",borderRadius:12,border:aspectRatio===ratio?"2px solid #a855f7":"1px solid rgba(255,255,255,.14)",background:aspectRatio===ratio?"rgba(168,85,247,.18)":"rgba(255,255,255,.03)",color:"inherit",fontWeight:700,cursor:"pointer"}}>{ratio}</button>)}</div>
      <button className="generate-btn" disabled={loading} onClick={handleGenerate}>{loading?<div className="generate-loading"><div className="generate-timer">⏳ {Math.floor(elapsedTime/60)}:{String(elapsedTime%60).padStart(2,"0")}</div><div className="generate-status">{loadingMessage}</div></div>:<><div style={{fontSize:15,fontWeight:700,lineHeight:1.15}}>Generate Lookbook Pack</div><div style={{marginTop:4,fontSize:11,fontWeight:500,opacity:.78}}>2 ⚡ · ~7–8 min · {aspectRatio}</div></>}</button>
    </div></div>
    <LookbookHeroPickerModal open={heroPickerOpen} onClose={()=>setHeroPickerOpen(false)} onSelect={(url,_type,_heroUrl,selectedGenderFromAsset,selectedCategoryFromAsset)=>{if(heroPickerTarget==="front")setFrontHero(url);if(heroPickerTarget==="back")setBackHero(url);if(selectedGenderFromAsset)setSelectedGender(selectedGenderFromAsset);if(selectedCategoryFromAsset)setSelectedCategory(selectedCategoryFromAsset);setHeroPickerOpen(false);}}/>
  </>;
}
