import { useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, CircleHelp, Crown, ImagePlus,
  Sparkles, WandSparkles, X, Heart, SlidersHorizontal,
  CheckCircle2, UserRound, Camera, Trash2, FileText, Loader2
} from "lucide-react";
import "./MakeMyMuse.css";
import { makemymuseApi } from "../../features/makemymuse/services/makemymuseApi";
import type { MuseCandidate, MuseGender, MuseRefinement, SavedMuse } from "../../features/makemymuse/services/makemymuseApi";

type Muse = { id: string; name: string; image: string; created: string; body: string };
const sampleFemale = [
  "https://images.unsplash.com/photo-1534523231584-76b3b6e1b7c8?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=88"
];
const sampleMale = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=88"
];
const sampleAndrogynous = [...sampleFemale.slice(0,4),...sampleMale.slice(0,4)];
const candidateLabels = ["The Muse","The Classic","The Modern","The Bold","The Soft","The Editorial","The Elegant","The Icon"];
const steps = ["Reference","Key frame","Details","Choose face","Refine","Face approval","Body","Reveal"];
const bodies = [
  {name:"Petite",note:"A compact, delicate silhouette",image:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"},
  {name:"Slim",note:"A lean, elongated silhouette",image:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80"},
  {name:"Athletic",note:"A balanced, toned silhouette",image:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80"},
  {name:"Curvy",note:"A fuller, naturally proportioned silhouette",image:"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80"}
];

export default function MakeMyMusePreview() {
  const [stage,setStage] = useState(-1);
  const [reference,setReference] = useState<string|null>(null);
  const [file,setFile] = useState<File|null>(null);
  const [fileName,setFileName] = useState("");
  const [consent,setConsent] = useState(false);
  const [sessionId,setSessionId] = useState("");
  const [gender,setGender] = useState<MuseGender>("female");
  const [age,setAge] = useState(25);
  const [skin,setSkin] = useState("reference");
  const [selected,setSelected] = useState<number|null>(null);
  const [candidates,setCandidates] = useState<MuseCandidate[]>([]);
  const [collage,setCollage] = useState<{imageUrl:string;publicId:string}|null>(null);
  const [promptPreview,setPromptPreview] = useState("");
  const [showPrompt,setShowPrompt] = useState(false);
  const [body,setBody] = useState("");
  const [name,setName] = useState("");
  const [saved,setSaved] = useState<Muse[]>([]);
  const [dashboard,setDashboard] = useState(false);
  const [refine,setRefine] = useState<MuseRefinement>({eyes:"natural",faceShape:"soft-oval",hair:"long-waves",lips:"balanced"});
  const [refinementPreview,setRefinementPreview] = useState<{id:string;publicId:string;imageUrl:string}|null>(null);
  const [useRefinement,setUseRefinement] = useState(false);
  const [approvedImage,setApprovedImage] = useState("");
  const [finalImage,setFinalImage] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const selectedCandidate = selected===null?null:candidates[selected];
  const selectedImage = selectedCandidate?.imageUrl || "";
  const displayedRefinement = useRefinement && refinementPreview ? refinementPreview.imageUrl : selectedImage;
  const candidateSamples = gender==="male"?sampleMale:gender==="androgynous"?sampleAndrogynous:sampleFemale;
  const candidateImages = candidates.length===8?candidates.map(c=>c.imageUrl):candidateSamples;
  const progress=stage<0?0:Math.min(100,((stage+1)/8)*100);

  const onUpload=(f?:File)=>{
    if(!f)return;
    setFile(f);setFileName(f.name);setReference(URL.createObjectURL(f));setError("");
  };
  const go=(next:number)=>{setDashboard(false);setStage(next);setError("");setShowPrompt(false);window.scrollTo({top:0,behavior:"smooth"});};
  const startSession=async()=>{
    if(!file||!consent)return;
    setLoading(true);setError("");
    try{
      const uploaded=await makemymuseApi.uploadReference(file);
      const session=await makemymuseApi.createSession(uploaded.publicId,consent,uploaded.sourceHash);
      setSessionId(session.sessionId);
      go(1);
    }catch(e:any){setError(e.message||"Reference upload failed.");}
    finally{setLoading(false);}
  };
  const brief={genderPresentation:gender,apparentAge:age,skinDirection:skin,transformationDirection:"Distinctive synthetic fashion-model identity; controlled transformation with meaningful resemblance influence."};
  const reviewPrompt=async()=>{
    setLoading(true);setError("");
    try{const data=await makemymuseApi.promptPreview(sessionId,brief);setPromptPreview(data.prompt);setShowPrompt(true);}
    catch(e:any){setError(e.message||"Prompt preview unavailable.");}
    finally{setLoading(false);}
  };
  const createCandidates=async()=>{
    setLoading(true);setError("");setShowPrompt(false);
    try{
      const data=await makemymuseApi.generateCandidates(sessionId,brief);
      setCandidates(data.candidates);setCollage(data.collage);setSelected(null);go(3);
    }catch(e:any){setError(e.message||"Candidate generation failed.");}
    finally{setLoading(false);}
  };
  const previewRefinement=async()=>{
    if(!selectedCandidate)return;
    setLoading(true);setError("");setUseRefinement(false);
    try{
      const data=await makemymuseApi.refinePreview(sessionId,selectedCandidate.publicId,refine);
      setRefinementPreview({id:data.refinementId,publicId:data.previewPublicId,imageUrl:data.previewImageUrl});
    }catch(e:any){setError(e.message||"Refinement preview failed.");}
    finally{setLoading(false);}
  };
  const approveFace=async()=>{
    if(!selectedCandidate)return;
    setLoading(true);setError("");
    try{
      const data=await makemymuseApi.approveFace(sessionId,selectedCandidate.publicId,useRefinement&&refinementPreview?refinementPreview.id:undefined);
      setApprovedImage(data.approvedImageUrl);go(5);
    }catch(e:any){setError(e.message||"Face approval failed.");}
    finally{setLoading(false);}
  };
  const generateFinal=async()=>{
    setLoading(true);setError("");
    try{const data=await makemymuseApi.generateFinal(sessionId,body);setFinalImage(data.imageUrl);go(7);}
    catch(e:any){setError(e.message||"Final model generation failed.");}
    finally{setLoading(false);}
  };
  const saveMuse=async()=>{
    setLoading(true);setError("");
    try{
      const data=await makemymuseApi.save(sessionId,name.trim()||"My Muse");
      const item:Muse={id:data.sessionId,name:data.name,image:data.imageUrl,created:new Date().toLocaleDateString(),body:body||"Slim"};
      setSaved((prev)=>[item,...prev]);setDashboard(false);setStage(8);
    }catch(e:any){setError(e.message||"Save failed.");}
    finally{setLoading(false);}
  };

  const loadMuses=async()=>{
    setLoading(true);setError("");
    try{
      const data=await makemymuseApi.listMuses();
      setSaved(data.muses.map((m:SavedMuse)=>({id:m.id,name:m.name,image:m.image,body:m.body,created:new Date(m.created).toLocaleDateString()})));
      setDashboard(true);setStage(8);
    }catch(e:any){setError(e.message||"Could not load My Muses.");}
    finally{setLoading(false);}
  };
  const deleteSavedMuse=async(id:string)=>{
    setLoading(true);setError("");
    try{await makemymuseApi.deleteMuse(id);setSaved(prev=>prev.filter(m=>m.id!==id));}
    catch(e:any){setError(e.message||"Muse deletion failed.");}
    finally{setLoading(false);}
  };
  const downloadCertificate=async()=>{
    setLoading(true);setError("");
    try{
      const cert=await makemymuseApi.certificate(sessionId);
      const file=new Blob([JSON.stringify(cert,null,2)],{type:"application/json"});
      const url=URL.createObjectURL(file);
      const a=document.createElement("a");a.href=url;a.download="MakeMyMuse-Creation-Certificate-"+sessionId+".json";a.click();
      URL.revokeObjectURL(url);
    }catch(e:any){setError(e.message||"Certificate download failed.");}
    finally{setLoading(false);}
  };

  return <div className="mmm">
    <header className="mmm-topbar">
      <button className="mmm-brand" onClick={loadMuses} aria-label="MakeMyMuse home">
        <span className="mmm-brand-mark"><Sparkles size={17}/></span><span>MakeMy<span className="mmm-brand-accent">Muse</span></span>
      </button>
      <nav className="mmm-nav"><button className={dashboard?"active":""} onClick={loadMuses}>My Muses</button><button onClick={()=>go(-1)}>Create</button></nav>
      <div className="mmm-top-right"><span className="mmm-pill"><Sparkles size={13}/> Creative Studio</span><button className="mmm-avatar">MG</button></div>
    </header>

    {dashboard ? <main className="mmm-dashboard">
      <div className="mmm-dash-head"><div><div className="mmm-eyebrow">YOUR CREATIVE COLLECTION</div><h1>Meet your <em>Muses.</em></h1><p>Distinctive characters, created by you. Ready to be brought to life.</p></div><button className="mmm-button mmm-button-dark" onClick={()=>go(0)}><Sparkles size={16}/> Create a new Muse</button></div>
      <div className="mmm-dash-grid">
        {saved.map(m=><article className="mmm-muse-card" key={m.id}><img src={m.image}/><div className="mmm-muse-info"><div><h3>{m.name}</h3><p>Created {m.created} · {m.body}</p></div><button className="mmm-icon-button" title="Delete Muse and private assets" disabled={loading} onClick={()=>deleteSavedMuse(m.id)}><Trash2 size={16}/></button></div></article>)}
        {!saved.length&&<div className="mmm-empty"><div className="mmm-empty-icon"><Sparkles/></div><h2>Your collection begins here.</h2><p>Create a character you love—and make it yours.</p><button className="mmm-button mmm-button-dark" onClick={()=>go(0)}>Create my first Muse <ArrowRight size={16}/></button></div>}
      </div>{error&&<div className="mmm-error">{error}</div>}
    </main> : stage===-1 ? <main className="mmm-welcome">
      <div className="mmm-welcome-copy"><div className="mmm-eyebrow"><span className="mmm-dot"/> A NEW KIND OF CREATIVE IDENTITY</div><h1>Your brand<br/>deserves its<br/><em>own face.</em></h1><p>Turn a photograph into a distinctive digital Muse. Inspired by you. Transformed by us. Uniquely yours.</p><button className="mmm-button mmm-button-dark mmm-button-xl" onClick={()=>go(0)}>Create your Muse <ArrowRight size={18}/></button><div className="mmm-welcome-meta"><span><Sparkles size={14}/> Personalised character creation</span><span>01 / 08</span></div></div><div className="mmm-welcome-art"><div className="mmm-art-orbit mmm-orbit-1"/><div className="mmm-art-orbit mmm-orbit-2"/><div className="mmm-art-image"><img src={sampleFemale[0]} alt="Fashion editorial portrait"/></div><div className="mmm-floating-note mmm-note-top"><span className="mmm-note-icon"><Sparkles size={15}/></span><div><strong>Designed to be yours</strong><small>A character. Your creative identity.</small></div></div><div className="mmm-floating-note mmm-note-bottom"><div className="mmm-note-avatars">{sampleFemale.slice(0,3).map((u,i)=><img key={i} src={u}/>)}</div><div><strong>8 distinct faces</strong><small>Find the one that feels right</small></div></div><div className="mmm-art-caption">THE ART OF BECOMING</div></div>
    </main> : stage===8 ? <main className="mmm-done">
      <div className="mmm-done-image"><img src={finalImage||approvedImage} alt="Your completed Muse"/><div className="mmm-image-label"><CheckCircle2 size={15}/> IDENTITY CREATED</div></div><div className="mmm-done-copy"><div className="mmm-eyebrow">YOUR CREATION, COMPLETE</div><h1>Meet <em>{name||"your Muse"}.</em></h1><p>A distinctive digital character, created through your choices. Your Muse is ready for its next chapter.</p><div className="mmm-done-actions"><button className="mmm-button mmm-button-dark mmm-button-xl" disabled={loading} onClick={downloadCertificate}>{loading?<Loader2 size={16} className="mmm-spin"/>:"Download Creation Record"} <FileText size={18}/></button><button className="mmm-button mmm-button-outline" onClick={()=>{setDashboard(true)}}>View My Muses</button><button className="mmm-button mmm-button-outline" onClick={()=>go(0)}>Create another</button></div><div className="mmm-done-foot"><span><Check size={15}/> Face approved</span><span><Check size={15}/> Body selected</span><span><Check size={15}/> Identity saved</span></div></div>
    </main> : <main className="mmm-flow">
      <div className="mmm-flow-header"><button className="mmm-back" onClick={()=>go(stage===0?-1:stage-1)}><ArrowLeft size={16}/><span>Back</span></button><div className="mmm-step-label">CREATE YOUR MUSE <span>·</span> STEP {stage+1} OF 8</div><button className="mmm-help"><CircleHelp size={16}/><span>Help</span></button></div>
      <div className="mmm-progress"><div style={{width:progress+"%"}}/></div>
      <div className="mmm-stepper">{steps.map((s,i)=><div key={s} className={"mmm-step "+(stage===i?"current":stage>i?"complete":"")}><span className="mmm-step-circle">{stage>i?<Check size={12}/>:i+1}</span><span className="mmm-step-name">{s}</span></div>)}</div>

      {stage===0&&<section className="mmm-step-content mmm-upload-step"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 01 · YOUR INSPIRATION</div><h1>Every Muse begins<br/>with a <em>spark.</em></h1><p>Upload a face that inspires your creation. It can be you, or someone you have permission to use.</p></div><div className="mmm-upload-layout"><div className="mmm-upload-card">{reference?<div className="mmm-upload-preview"><img src={reference}/><button className="mmm-remove" onClick={()=>{setReference(null);setFile(null);setFileName("");setConsent(false)}}><X size={16}/></button><div className="mmm-upload-file">{fileName||"Reference photo"}</div></div>:<label className="mmm-dropzone"><input type="file" accept="image/*" onChange={e=>onUpload(e.target.files?.[0])}/><div className="mmm-upload-symbol"><ImagePlus size={26}/></div><h3>Drop your image here</h3><p>or browse your device</p><span className="mmm-button mmm-button-outline">Choose photo</span><small>JPG · PNG · WEBP · Up to 15 MB</small></label>}</div><aside className="mmm-upload-tips"><h3>For a beautiful result</h3><div><Camera size={17}/><span>Face clearly visible, ideally looking toward camera</span></div><div><Sparkles size={17}/><span>Natural lighting and an unfiltered image</span></div><div><UserRound size={17}/><span>One person in the frame</span></div><div className="mmm-consent"><CheckCircle2 size={16}/><span>Use only images you own or are authorised to use.</span></div><label className="mmm-consent-checkbox"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>I confirm the person shown is an adult, I own this image or have permission and consent to use it, and I authorize AI processing and private storage for synthetic fashion identity creation.</span></label></aside></div><div className="mmm-step-footer"><span className="mmm-foot-note">Reference images are stored privately.</span><button className="mmm-button mmm-button-dark" disabled={!reference||!file||!consent||loading} onClick={startSession}>{loading?<Loader2 size={16} className="mmm-spin"/>:"Create my key frame"} {!loading&&<ArrowRight size={16}/>}</button></div>{error&&<div className="mmm-error">{error}</div>}</section>}

      {stage===1&&<section className="mmm-step-content mmm-keyframe"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 02 · IDENTITY BLUEPRINT</div><h1>We study the inspiration.<br/><em>Then create possibility.</em></h1><p>Your reference helps guide the creative transformation. Explore a visual blueprint of the face before we begin shaping your Muse.</p></div><div className="mmm-blueprint-layout"><div className="mmm-blueprint-reference"><img src={reference||sampleFemale[0]}/><div className="mmm-photo-tag">YOUR INSPIRATION</div><div className="mmm-blueprint-reference-caption"><span>REFERENCE IMAGE</span><span>01</span></div></div><div className="mmm-blueprint-main"><div className="mmm-blueprint-portrait"><img src={reference||sampleFemale[0]} alt="Uploaded inspiration visualised as an identity blueprint"/><div className="mmm-blueprint-viz" aria-hidden="true"><svg viewBox="0 0 360 440" preserveAspectRatio="none"><g className="mmm-mesh-lines"><path d="M180 60 C105 65 75 130 83 205 C91 286 125 343 180 365 C235 343 269 286 277 205 C285 130 255 65 180 60Z"/><path d="M115 150 Q180 115 245 150 M108 180 Q180 210 252 180 M130 250 Q180 270 230 250 M145 305 Q180 320 215 305 M180 60 L180 365 M83 205 L277 205 M110 135 L250 135 M125 285 L235 285 M120 95 L240 95 M105 240 L255 240"/><path d="M115 150 L130 185 L155 175 L180 185 L205 175 L230 185 L245 150 M130 250 L155 230 L180 240 L205 230 L230 250 M145 305 L180 285 L215 305"/><circle cx="130" cy="180" r="3"/><circle cx="230" cy="180" r="3"/><circle cx="180" cy="220" r="3"/><circle cx="155" cy="270" r="3"/><circle cx="205" cy="270" r="3"/></g><g className="mmm-blueprint-scan"><path d="M20 218 H340"/></g></svg></div><div className="mmm-blueprint-status"><span className="mmm-blueprint-pulse"/><span>IDENTITY BLUEPRINT</span><span>VISUAL PREVIEW</span></div></div><div className="mmm-blueprint-insights"><div className="mmm-blueprint-insight"><span className="mmm-insight-icon">01</span><div><strong>Face contour</strong><small>Shape and proportions as creative reference</small></div><span className="mmm-insight-status">REFERENCE</span></div><div className="mmm-blueprint-insight"><span className="mmm-insight-icon">02</span><div><strong>Eye placement</strong><small>Visual relationship and expression cues</small></div><span className="mmm-insight-status">REFERENCE</span></div><div className="mmm-blueprint-insight"><span className="mmm-insight-icon">03</span><div><strong>Facial balance</strong><small>Features considered together as a whole</small></div><span className="mmm-insight-status">REFERENCE</span></div></div></div></div><div className="mmm-step-footer"><span className="mmm-foot-note"><Sparkles size={14}/> A visual creative-reference preview—not a biometric report.</span><button className="mmm-button mmm-button-dark" onClick={()=>go(2)}>Continue <ArrowRight size={16}/></button></div></section>}

      {stage===2&&<section className="mmm-step-content mmm-details"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 03 · YOUR CREATIVE DIRECTION</div><h1>Give your Muse<br/><em>a little direction.</em></h1><p>A few simple choices help us create faces that feel closer to your imagination.</p></div><div className="mmm-parameter-card"><div className="mmm-parameter-row"><div><label>Gender presentation</label><small>Choose the look you want to create</small></div><div className="mmm-choice-row">{["female","male","androgynous"].map(x=><button className={gender===x?"selected":""} onClick={()=>setGender(x as MuseGender)} key={x}>{x==="androgynous"?"Androgynous":x.charAt(0).toUpperCase()+x.slice(1)}</button>)}</div></div><div className="mmm-parameter-row"><div><label>Age appearance</label><small>Adult age appearance, 18–60</small></div><div className="mmm-age-control"><input aria-label="Age appearance" type="range" min="18" max="60" value={age} onChange={e=>setAge(Number(e.target.value)} /><strong>{age} years</strong></div></div><div className="mmm-parameter-row"><div><label>Skin appearance</label><small>Creative direction—not a limitation</small></div><select value={skin} onChange={e=>setSkin(e.target.value)}><option value="reference">Keep inspired by reference</option><option value="warm">Warm tones</option><option value="cool">Cool tones</option><option value="neutral">Neutral tones</option><option value="explore">Explore a new direction</option></select></div></div><div className="mmm-step-footer"><span className="mmm-foot-note">The choices are compiled into a versioned generation prompt.</span><div className="mmm-step-actions"><button className="mmm-button mmm-button-outline" disabled={loading} onClick={reviewPrompt}><FileText size={15}/> Review prompt</button><button className="mmm-button mmm-button-dark" disabled={loading} onClick={createCandidates}>{loading?<><Loader2 size={16} className="mmm-spin"/> Generating 8 candidates…</>:"Generate 8 faces"} <Sparkles size={16}/></button></div></div>{showPrompt&&<div className="mmm-prompt-review"><div className="mmm-prompt-review-title"><strong>Prompt Preview</strong><button onClick={()=>setShowPrompt(false)}><X size={16}/></button></div><pre>{promptPreview}</pre><small>Prompt version and hash are recorded with generation history.</small></div>}{error&&<div className="mmm-error">{error}</div>}</section>}

      {stage===3&&<section className="mmm-step-content mmm-candidates"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 04 · FIND YOUR FACE</div><h1>Eight possibilities.<br/><em>One feels like you.</em></h1><p>These candidates were generated from your reference and creative direction. Select the face that feels right.</p>{collage&&<div className="mmm-batch-note"><Sparkles size={14}/> ONE GENERATION BATCH <span>·</span> 8 CANDIDATES</div>}</div><div className="mmm-candidate-grid">{candidateImages.map((url,i)=><button key={i} className={"mmm-candidate "+(selected===i?"chosen":"")} onClick={()=>{setSelected(i);setRefinementPreview(null);setUseRefinement(false)}}><div className="mmm-candidate-image"><img src={url} alt={"Candidate "+(i+1)}/><span className="mmm-candidate-number">0{i+1}</span>{selected===i&&<span className="mmm-selected-badge"><Check size={13}/> SELECTED</span>}</div><div className="mmm-candidate-label"><span>{candidateLabels[i]}</span><span className="mmm-candidate-check">{selected===i?<Check size={14}/>:<Heart size={14}/>}</span></div></button>)}</div><div className="mmm-step-footer"><span className="mmm-foot-note">Generation batch: {collage?.publicId||"—"}</span><button className="mmm-button mmm-button-dark" disabled={selected===null} onClick={()=>go(4)}>Refine selected face <ArrowRight size={16}/></button></div>{error&&<div className="mmm-error">{error}</div>}</section>}

      {stage===4&&<section className="mmm-step-content mmm-refine"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 05 · MAKE IT YOURS</div><h1>Fine-tune the<br/><em>face you love.</em></h1><p>Shape the details. Keep what feels right. Changes generate an actual preview from your selected candidate.</p></div><div className="mmm-refine-layout mmm-refine-compare"><div className="mmm-refine-image"><img src={selectedImage}/><div className="mmm-refine-image-caption"><Sparkles size={14}/> ORIGINAL SELECTED FACE</div></div><div className="mmm-refine-image mmm-refine-result">{refinementPreview?<img src={refinementPreview.imageUrl}/>:<div className="mmm-refine-empty-preview"><WandSparkles size={22}/><span>Preview Changes to generate the refined face</span></div>}<div className="mmm-refine-image-caption"><Sparkles size={14}/> ACTUAL GENERATED PREVIEW</div></div></div><div className="mmm-refine-controls mmm-refine-controls-wide"><div className="mmm-control-heading"><SlidersHorizontal size={16}/><span>Refinement studio</span><span className="mmm-control-soft">CREATIVE OPTIONS</span></div>{Object.entries(refine).map(([key,val])=><div className="mmm-refine-control" key={key}><div><label>{key==="faceShape"?"Face shape":key==="eyes"?"Eyes":key==="hair"?"Hair":"Lips"}</label><span>{val}</span></div><select value={val} onChange={e=>{setRefine(prev=>({...prev,[key]:e.target.value}));setRefinementPreview(null);setUseRefinement(false)}}>{(key==="faceShape"?["soft-oval","heart","round","defined","long"]:key==="eyes"?["natural","almond","soft-round","defined","lifted"]:key==="hair"?["long-waves","straight","soft-curls","short","layered"]:["balanced","fuller","soft","defined"]).map(o=><option key={o} value={o}>{o.replace(/-/g," ")}</option>)}</select></div>)}<button className="mmm-button mmm-button-outline mmm-refine-preview" disabled={loading||selected===null} onClick={previewRefinement}>{loading?<><Loader2 size={16} className="mmm-spin"/> Generating refinement…</>:<><WandSparkles size={16}/> Preview Changes</>}</button>{refinementPreview&&<div className="mmm-refine-success"><CheckCircle2 size={15}/> Actual generated preview ready. Compare it with the original.</div>}</div><div className="mmm-step-footer"><span className="mmm-foot-note">Original candidate is preserved; preview is a separate asset.</span><div className="mmm-step-actions"><button className="mmm-button mmm-button-outline" disabled={!refinementPreview} onClick={()=>setUseRefinement(false)}>Keep Original</button><button className="mmm-button mmm-button-outline" disabled={!refinementPreview} onClick={()=>setUseRefinement(true)}>Apply Preview</button><button className="mmm-button mmm-button-dark" disabled={loading||selected===null} onClick={approveFace}>{loading?<Loader2 size={16} className="mmm-spin"/>:"Approve face"} <ArrowRight size={16}/></button></div></div>{error&&<div className="mmm-error">{error}</div>}</section>}

      {stage===5&&<section className="mmm-step-content mmm-approve"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 06 · IDENTITY APPROVAL</div><h1>Is this <em>your Muse?</em></h1><p>Your approval records the selected face and whether you accepted a refinement preview.</p></div><div className="mmm-approve-layout"><div className="mmm-approve-image"><img src={approvedImage||displayedRefinement}/><div className="mmm-approved-stamp"><CheckCircle2 size={17}/> FACE APPROVED</div></div><div className="mmm-approve-side"><div className="mmm-identity-lock"><div><CheckCircle2 size={20}/></div><h3>Identity reference</h3><p>The approved image becomes the reference for final model generation. The selection and approval event are recorded in creation history.</p></div><button className="mmm-button mmm-button-outline" onClick={()=>go(4)}><SlidersHorizontal size={15}/> Make more refinements</button><button className="mmm-button mmm-button-dark" onClick={()=>go(6)}>Continue to body <ArrowRight size={16}/></button></div></div></section>}

      {stage===6&&<section className="mmm-step-content mmm-body"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 07 · COMPLETE YOUR MODEL</div><h1>Now, choose your<br/><em>silhouette.</em></h1><p>The face is approved. Choose a body type to complete your model.</p></div><div className="mmm-body-grid">{bodies.map(b=><button className={"mmm-body-card "+(body===b.name?"selected":"")} key={b.name} onClick={()=>setBody(b.name)}><div className="mmm-body-image"><img src={b.image}/>{body===b.name&&<span className="mmm-body-check"><Check size={15}/></span>}</div><div className="mmm-body-label"><h3>{b.name}</h3><p>{b.note}</p></div></button>)}</div><div className="mmm-step-footer"><span className="mmm-foot-note">Final generation uses your approved face as the reference.</span><button className="mmm-button mmm-button-dark" disabled={!body||loading} onClick={generateFinal}>{loading?<><Loader2 size={16} className="mmm-spin"/> Generating final model…</>:"Generate final model"} <Sparkles size={16}/></button></div>{error&&<div className="mmm-error">{error}</div>}</section>}

      {stage===7&&<section className="mmm-step-content mmm-finalize"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 08 · YOUR MUSE REVEAL</div><h1>Bring your Muse<br/><em>to life.</em></h1><p>The final model has been generated. Name and save your Muse to complete creation.</p></div><div className="mmm-finalize-layout"><div className="mmm-final-image"><img src={finalImage}/><div className="mmm-final-image-tag"><Sparkles size={14}/> GENERATED FINAL MODEL</div></div><div className="mmm-final-form"><div className="mmm-final-form-top"><div className="mmm-final-form-icon"><Crown size={20}/></div><div><h3>Your character is ready</h3><p>Face approved · Body selected</p></div></div><label htmlFor="mmm-name">Name your Muse</label><input id="mmm-name" placeholder="e.g. Anaya, Sophia, The Muse…" value={name} onChange={e=>setName(e.target.value)} maxLength={40}/><div className="mmm-name-note">This name will identify your reusable character.</div><button className="mmm-button mmm-button-dark mmm-button-xl mmm-save" disabled={loading} onClick={saveMuse}>{loading?<Loader2 size={17} className="mmm-spin"/>:"Save my Muse"} <Check size={17}/></button><div className="mmm-final-checklist"><span><Check size={14}/> Distinctive face selected</span><span><Check size={14}/> Face identity approved</span><span><Check size={14}/> Body type chosen</span></div></div></div>{error&&<div className="mmm-error">{error}</div>}</section>}
    </main>}
    <footer className="mmm-footer"><span>MakeMyMuse <span className="mmm-footer-dot">·</span> Create a character that is uniquely yours.</span><span>PRIVATE CREATIVE STUDIO</span></footer>
  </div>;
}
