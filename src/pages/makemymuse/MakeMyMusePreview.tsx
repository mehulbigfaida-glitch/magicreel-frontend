import { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, CircleHelp, Crown, ImagePlus,
  Sparkles, WandSparkles, X, Heart, SlidersHorizontal,
  CheckCircle2, UserRound, Camera, Trash2
} from "lucide-react";
import "./MakeMyMuse.css";

type Muse = { id: number; name: string; image: string; created: string; body: string };
const portraitUrls = [
  "https://images.unsplash.com/photo-1534523231584-76b3b6e1b7c8?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=88"
];
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
  const [fileName,setFileName] = useState("");
  const [gender,setGender] = useState("Female");
  const [age,setAge] = useState("25–30");
  const [skin,setSkin] = useState("Keep inspired by reference");
  const [selected,setSelected] = useState<number|null>(null);
  const [body,setBody] = useState("");
  const [name,setName] = useState("");
  const [saved,setSaved] = useState<Muse[]>([]);
  const [dashboard,setDashboard] = useState(false);
  const [refine,setRefine] = useState({eyes:"Natural",face:"Soft oval",hair:"Long waves",lips:"Balanced"});
  const [refined,setRefined] = useState(false);
  const [generating,setGenerating] = useState(false);
  const finalImage = selected===null ? portraitUrls[0] : portraitUrls[selected];

  const onUpload=(file?:File)=>{
    if(!file) return;
    setFileName(file.name);
    setReference(URL.createObjectURL(file));
  };
  const go=(next:number)=>{setDashboard(false);setStage(next);window.scrollTo({top:0,behavior:"smooth"});};
  const saveMuse=()=>{
    const item:Muse={id:Date.now(),name:name.trim()||"My Muse",image:finalImage,created:new Date().toLocaleDateString(),body:body||"Slim"};
    setSaved((prev)=>[item,...prev]);setDashboard(true);setStage(8);
  };
  const progress=stage<0?0:Math.min(100,((stage+1)/8)*100);
  const candidateImages=useMemo(()=>portraitUrls,[ ]);

  return <div className="mmm">
    <header className="mmm-topbar">
      <button className="mmm-brand" onClick={()=>{setDashboard(true);setStage(8)}} aria-label="MakeMyMuse home">
        <span className="mmm-brand-mark"><Sparkles size={17}/></span><span>MakeMy<span className="mmm-brand-accent">Muse</span></span>
      </button>
      <nav className="mmm-nav"><button className={dashboard?"active":""} onClick={()=>{setDashboard(true);setStage(8)}}>My Muses</button><button onClick={()=>go(-1)}>Create</button></nav>
      <div className="mmm-top-right"><span className="mmm-pill"><Sparkles size={13}/> Creative Studio</span><button className="mmm-avatar">MG</button></div>
    </header>

    {dashboard ? <main className="mmm-dashboard">
      <div className="mmm-dash-head"><div><div className="mmm-eyebrow">YOUR CREATIVE COLLECTION</div><h1>Meet your <em>Muses.</em></h1><p>Distinctive characters, created by you. Ready to be brought to life.</p></div><button className="mmm-button mmm-button-dark" onClick={()=>go(0)}><Sparkles size={16}/> Create a new Muse</button></div>
      <div className="mmm-dash-grid">
        {saved.map(m=><article className="mmm-muse-card" key={m.id}><img src={m.image}/><div className="mmm-muse-info"><div><h3>{m.name}</h3><p>Created {m.created} · {m.body}</p></div><button className="mmm-icon-button" title="Delete" onClick={()=>setSaved(s=>s.filter(x=>x.id!==m.id))}><Trash2 size={16}/></button></div></article>)}
        {!saved.length&&<div className="mmm-empty"><div className="mmm-empty-icon"><Sparkles/></div><h2>Your collection begins here.</h2><p>Create a character you love—and make it yours.</p><button className="mmm-button mmm-button-dark" onClick={()=>go(0)}>Create my first Muse <ArrowRight size={16}/></button></div>}
      </div>
    </main> : stage===-1 ? <main className="mmm-welcome">
      <div className="mmm-welcome-copy"><div className="mmm-eyebrow"><span className="mmm-dot"/> A NEW KIND OF CREATIVE IDENTITY</div><h1>Your brand<br/>deserves its<br/><em>own face.</em></h1><p>Turn a photograph into a distinctive digital Muse. Inspired by you. Transformed by us. Uniquely yours.</p><button className="mmm-button mmm-button-dark mmm-button-xl" onClick={()=>go(0)}>Create your Muse <ArrowRight size={18}/></button><div className="mmm-welcome-meta"><span><Sparkles size={14}/> Personalised character creation</span><span>01 / 08</span></div></div>
      <div className="mmm-welcome-art"><div className="mmm-art-orbit mmm-orbit-1"/><div className="mmm-art-orbit mmm-orbit-2"/><div className="mmm-art-image"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=90" alt="Fashion editorial portrait"/></div><div className="mmm-floating-note mmm-note-top"><span className="mmm-note-icon"><Sparkles size={15}/></span><div><strong>Designed to be yours</strong><small>A character. Your creative identity.</small></div></div><div className="mmm-floating-note mmm-note-bottom"><div className="mmm-note-avatars">{portraitUrls.slice(0,3).map((u,i)=><img key={i} src={u}/>)}</div><div><strong>8 distinct faces</strong><small>Find the one that feels right</small></div></div><div className="mmm-art-caption">THE ART OF BECOMING</div></div>
    </main> : stage===8 ? <main className="mmm-done">
      <div className="mmm-done-image"><img src={finalImage} alt="Your completed Muse"/><div className="mmm-image-label"><CheckCircle2 size={15}/> IDENTITY CREATED</div></div><div className="mmm-done-copy"><div className="mmm-eyebrow">YOUR CREATION, COMPLETE</div><h1>Meet <em>{name||"your Muse"}.</em></h1><p>A distinctive digital character, created through your choices. Your Muse is ready for her next chapter.</p><div className="mmm-done-actions"><button className="mmm-button mmm-button-dark mmm-button-xl" onClick={()=>{setDashboard(true)}}>Save & view My Muses <ArrowRight size={18}/></button><button className="mmm-button mmm-button-outline" onClick={()=>go(0)}>Create another</button></div><div className="mmm-done-foot"><span><Check size={15}/> Face approved</span><span><Check size={15}/> Body selected</span><span><Check size={15}/> Identity saved</span></div></div>
    </main> : <main className="mmm-flow">
      <div className="mmm-flow-header"><button className="mmm-back" onClick={()=>go(stage===0?-1:stage-1)}><ArrowLeft size={16}/><span>Back</span></button><div className="mmm-step-label">CREATE YOUR MUSE <span>·</span> STEP {stage+1} OF 8</div><button className="mmm-help"><CircleHelp size={16}/><span>Help</span></button></div>
      <div className="mmm-progress"><div style={{width:progress+"%"}}/></div>
      <div className="mmm-stepper">{steps.map((s,i)=><div key={s} className={"mmm-step "+(stage===i?"current":stage>i?"complete":"")}><span className="mmm-step-circle">{stage>i?<Check size={12}/>:i+1}</span><span className="mmm-step-name">{s}</span></div>)}</div>

      {stage===0&&<section className="mmm-step-content mmm-upload-step"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 01 · YOUR INSPIRATION</div><h1>Every Muse begins<br/>with a <em>spark.</em></h1><p>Upload a face that inspires your creation. It can be you, or someone you have permission to use.</p></div><div className="mmm-upload-layout"><div className="mmm-upload-card">{reference?<div className="mmm-upload-preview"><img src={reference}/><button className="mmm-remove" onClick={()=>{setReference(null);setFileName("")}}><X size={16}/></button><div className="mmm-upload-file">{fileName||"Reference photo"}</div></div>:<label className="mmm-dropzone"><input type="file" accept="image/*" onChange={e=>onUpload(e.target.files?.[0])}/><div className="mmm-upload-symbol"><ImagePlus size={26}/></div><h3>Drop your image here</h3><p>or browse your device</p><span className="mmm-button mmm-button-outline">Choose photo</span><small>JPG · PNG · WEBP · Up to 15 MB</small></label>}</div><aside className="mmm-upload-tips"><h3>For a beautiful result</h3><div><Camera size={17}/><span>Face clearly visible, ideally looking toward camera</span></div><div><Sparkles size={17}/><span>Natural lighting and an unfiltered image</span></div><div><UserRound size={17}/><span>One person in the frame</span></div><div className="mmm-consent"><CheckCircle2 size={16}/><span>Use only images you own or are authorised to use.</span></div></aside></div><div className="mmm-step-footer"><span className="mmm-foot-note">Your reference is private to this creation.</span><button className="mmm-button mmm-button-dark" disabled={!reference} onClick={()=>go(1)}>Create my key frame <ArrowRight size={16}/></button></div></section>}

      {stage===1&&<section className="mmm-step-content mmm-keyframe"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 02 · FIRST TRANSFORMATION</div><h1>Meet your first<br/><em>possibility.</em></h1><p>We turn your inspiration into an open-pose key frame—the first glimpse of your future Muse.</p></div><div className="mmm-keyframe-layout"><div className="mmm-keyframe-photo"><img src={reference||portraitUrls[0]}/><div className="mmm-photo-tag">YOUR INSPIRATION</div></div><div className="mmm-keyframe-result"><img src={portraitUrls[1]}/><div className="mmm-keyframe-overlay"><div className="mmm-keyframe-badge"><Sparkles size={15}/> KEY FRAME PREVIEW</div><h2>A new identity<br/>is taking shape.</h2><p>Face structure, character and creative direction—ready for your choices.</p></div></div></div><div className="mmm-step-footer"><span className="mmm-foot-note"><Sparkles size={14}/> A preview of the transformation experience</span><button className="mmm-button mmm-button-dark" onClick={()=>go(2)}>Continue <ArrowRight size={16}/></button></div></section>}

      {stage===2&&<section className="mmm-step-content mmm-details"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 03 · YOUR CREATIVE DIRECTION</div><h1>Give your Muse<br/><em>a little direction.</em></h1><p>A few simple choices help us create faces that feel closer to your imagination.</p></div><div className="mmm-parameter-card"><div className="mmm-parameter-row"><div><label>Gender presentation</label><small>Choose the look you want to create</small></div><div className="mmm-choice-row">{["Female","Male","Custom"].map(x=><button className={gender===x?"selected":""} onClick={()=>setGender(x)} key={x}>{x}</button>)}</div></div><div className="mmm-parameter-row"><div><label>Age appearance</label><small>How old should your Muse appear?</small></div><div className="mmm-choice-row">{["18–24","25–30","31–40","40+"].map(x=><button className={age===x?"selected":""} onClick={()=>setAge(x)} key={x}>{x}</button>)}</div></div><div className="mmm-parameter-row"><div><label>Skin appearance</label><small>Creative direction—not a limitation</small></div><select value={skin} onChange={e=>setSkin(e.target.value)}><option>Keep inspired by reference</option><option>Warm tones</option><option>Cool tones</option><option>Neutral tones</option><option>Explore a new direction</option></select></div></div><div className="mmm-step-footer"><span className="mmm-foot-note">You can refine the face after choosing.</span><button className="mmm-button mmm-button-dark" onClick={()=>go(3)}>Create 8 faces <Sparkles size={16}/></button></div></section>}

      {stage===3&&<section className="mmm-step-content mmm-candidates"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 04 · FIND YOUR FACE</div><h1>Eight possibilities.<br/><em>One feels like you.</em></h1><p>Each face explores a different creative direction while drawing inspiration from your reference.</p></div><div className="mmm-candidate-grid">{candidateImages.map((url,i)=><button key={i} className={"mmm-candidate "+(selected===i?"chosen":"")} onClick={()=>setSelected(i)}><div className="mmm-candidate-image"><img src={url}/><span className="mmm-candidate-number">0{i+1}</span>{selected===i&&<span className="mmm-selected-badge"><Check size={13}/> SELECTED</span>}</div><div className="mmm-candidate-label"><span>{candidateLabels[i]}</span><span className="mmm-candidate-check">{selected===i?<Check size={14}/>:<Heart size={14}/>}</span></div></button>)}</div><div className="mmm-step-footer"><span className="mmm-foot-note">Select the face you want to make your own.</span><button className="mmm-button mmm-button-dark" disabled={selected===null} onClick={()=>go(4)}>Refine selected face <ArrowRight size={16}/></button></div></section>}

      {stage===4&&<section className="mmm-step-content mmm-refine"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 05 · MAKE IT YOURS</div><h1>Fine-tune the<br/><em>face you love.</em></h1><p>Shape the details. Keep what feels right. Change what you imagine differently.</p></div><div className="mmm-refine-layout"><div className="mmm-refine-image"><img src={finalImage}/><div className="mmm-refine-image-caption"><Sparkles size={14}/> YOUR SELECTED FACE</div></div><div className="mmm-refine-controls"><div className="mmm-control-heading"><SlidersHorizontal size={16}/><span>Refinement studio</span><span className="mmm-control-soft">VISUAL OPTIONS</span></div>{Object.entries(refine).map(([key,val])=><div className="mmm-refine-control" key={key}><div><label>{key==="face"?"Face shape":key==="eyes"?"Eyes":key==="hair"?"Hair":"Lips"}</label><span>{val}</span></div><select value={val} onChange={e=>{setRefine(prev=>({...prev,[key]:e.target.value}));setRefined(false)}}>{(key==="face"?["Soft oval","Heart-shaped","Round","Defined","Long"]:key==="eyes"?["Natural","Almond","Soft round","Defined","Lifted"]:key==="hair"?["Long waves","Straight","Soft curls","Short","Layered"]:["Balanced","Fuller","Soft","Defined"]).map(o=><option key={o}>{o}</option>)}</select></div>)}<button className="mmm-button mmm-button-outline mmm-refine-preview" onClick={()=>setRefined(true)}><WandSparkles size={16}/>{refined?"Preview updated":"Preview refinements"}</button>{refined&&<div className="mmm-refine-success"><CheckCircle2 size={15}/> Your creative choices are ready for preview.</div>}</div></div><div className="mmm-step-footer"><span className="mmm-foot-note">Refinement controls are a UI preview in this prototype.</span><button className="mmm-button mmm-button-dark" onClick={()=>go(5)}>Approve this face <ArrowRight size={16}/></button></div></section>}

      {stage===5&&<section className="mmm-step-content mmm-approve"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 06 · IDENTITY APPROVAL</div><h1>Is this <em>your Muse?</em></h1><p>Take a moment. This is the face that will carry your character's identity forward.</p></div><div className="mmm-approve-layout"><div className="mmm-approve-image"><img src={finalImage}/><div className="mmm-approved-stamp"><CheckCircle2 size={17}/> FACE APPROVED</div></div><div className="mmm-approve-side"><div className="mmm-identity-lock"><div><CheckCircle2 size={20}/></div><h3>Your identity reference</h3><p>Once approved, this face becomes the reference for your final full model.</p></div><button className="mmm-button mmm-button-outline" onClick={()=>go(4)}><SlidersHorizontal size={15}/> Make more refinements</button><button className="mmm-button mmm-button-dark" onClick={()=>go(6)}>Yes, this is my Muse <ArrowRight size={16}/></button></div></div><div className="mmm-step-footer"><span className="mmm-foot-note">You can go back and edit before approval.</span></div></section>}

      {stage===6&&<section className="mmm-step-content mmm-body"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 07 · COMPLETE YOUR MODEL</div><h1>Now, choose her<br/><em>silhouette.</em></h1><p>The face is final. Choose a body type to complete your model.</p></div><div className="mmm-body-grid">{bodies.map(b=><button className={"mmm-body-card "+(body===b.name?"selected":"")} key={b.name} onClick={()=>setBody(b.name)}><div className="mmm-body-image"><img src={b.image}/>{body===b.name&&<span className="mmm-body-check"><Check size={15}/></span>}</div><div className="mmm-body-label"><h3>{b.name}</h3><p>{b.note}</p></div></button>)}</div><div className="mmm-step-footer"><span className="mmm-foot-note">Body options are visual selections in this prototype.</span><button className="mmm-button mmm-button-dark" disabled={!body} onClick={()=>{setGenerating(true);setTimeout(()=>{setGenerating(false);go(7)},650)}}>{generating?"Creating your model…":"Create my model"} <Sparkles size={16}/></button></div></section>}

      {stage===7&&<section className="mmm-step-content mmm-finalize"><div className="mmm-step-title"><div className="mmm-eyebrow">STEP 08 · YOUR MUSE REVEAL</div><h1>Bring your Muse<br/><em>to life.</em></h1><p>One final step. Give your creation a name, and make it official.</p></div><div className="mmm-finalize-layout"><div className="mmm-final-image"><img src={finalImage}/><div className="mmm-final-image-tag"><Sparkles size={14}/> FINAL MODEL PREVIEW</div></div><div className="mmm-final-form"><div className="mmm-final-form-top"><div className="mmm-final-form-icon"><Crown size={20}/></div><div><h3>Your character is ready</h3><p>Face identity approved · Body selected</p></div></div><label htmlFor="mmm-name">Name your Muse</label><input id="mmm-name" placeholder="e.g. Anaya, Sophia, The Muse…" value={name} onChange={e=>setName(e.target.value)} maxLength={40}/><div className="mmm-name-note">This name will identify your reusable character.</div><button className="mmm-button mmm-button-dark mmm-button-xl mmm-save" onClick={saveMuse}>Save my Muse <Check size={17}/></button><div className="mmm-final-checklist"><span><Check size={14}/> Distinctive face selected</span><span><Check size={14}/> Face identity approved</span><span><Check size={14}/> Body type chosen</span></div></div></div></section>}
    </main>}
    <footer className="mmm-footer"><span>MakeMyMuse <span className="mmm-footer-dot">·</span> Create a character that is uniquely yours.</span><span>PRIVATE CREATIVE STUDIO</span></footer>
  </div>;
}
