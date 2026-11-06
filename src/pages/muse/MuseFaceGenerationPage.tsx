import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ImagePlus, Info, RefreshCw, Sparkles, Upload, X } from "lucide-react";
import "./MuseFaceGenerationPage.css";

type Texture = "original" | "natural" | "clear" | "editorial";
type FaceShape = "original" | "oval" | "round" | "square" | "heart" | "diamond";
type Hair = "source" | "explore" | "specific";
type Expression = "natural" | "smile" | "confident" | "editorial";
type Transformation = "preserve" | "distinctive" | "reimagine";

const skinTones = [
  { label: "Original", value: "original", color: "linear-gradient(135deg,#f0d1b7,#bd896c)" },
  { label: "Fair", value: "fair", color: "#f4ddca" },
  { label: "Light", value: "light", color: "#e8c09f" },
  { label: "Medium", value: "medium", color: "#d39a72" },
  { label: "Olive", value: "olive", color: "#b77d58" },
  { label: "Brown", value: "brown", color: "#89583e" },
  { label: "Deep", value: "deep", color: "#593a2d" },
];

const faceShapes: { value: FaceShape; label: string; detail: string }[] = [
  { value: "original", label: "Original", detail: "Preserve source proportions" },
  { value: "oval", label: "Oval", detail: "Soft, balanced contours" },
  { value: "round", label: "Round", detail: "Fuller, softer contours" },
  { value: "square", label: "Square", detail: "More defined jawline" },
  { value: "heart", label: "Heart", detail: "Wider forehead, tapered chin" },
  { value: "diamond", label: "Diamond", detail: "Defined cheekbones" },
];

const textures: { value: Texture; label: string; detail: string }[] = [
  { value: "original", label: "Original texture", detail: "Keep natural marks and detail" },
  { value: "natural", label: "Natural refinement", detail: "Subtle cleanup, visible pores" },
  { value: "clear", label: "Clear healthy skin", detail: "Reduce blemishes, retain texture" },
  { value: "editorial", label: "Editorial retouch", detail: "Polished, still photorealistic" },
];

function Choice<T extends string>({ value, selected, onSelect, label, detail }: {
  value: T; selected: T; onSelect: (value: T) => void; label: string; detail?: string;
}) {
  return <button type="button" className={`muse-choice ${selected === value ? "is-selected" : ""}`} onClick={() => onSelect(value)} aria-pressed={selected === value}>
    <span className="muse-choice-check">{selected === value ? <Check size={13}/> : null}</span>
    <span><strong>{label}</strong>{detail && <small>{detail}</small>}</span>
  </button>;
}

export default function MuseFaceGenerationPage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [age, setAge] = useState(25);
  const [skinTone, setSkinTone] = useState("original");
  const [faceShape, setFaceShape] = useState<FaceShape>("original");
  const [texture, setTexture] = useState<Texture>("natural");
  const [hair, setHair] = useState<Hair>("explore");
  const [specificHair, setSpecificHair] = useState("AI-selected");
  const [expression, setExpression] = useState<Expression>("natural");
  const [transformation, setTransformation] = useState<Transformation>("distinctive");
  const [direction, setDirection] = useState("original");
  const [count, setCount] = useState(8);
  const [consent, setConsent] = useState(false);
  const [notice, setNotice] = useState("");

  const fileSize = useMemo(() => file ? (file.size / (1024 * 1024)).toFixed(1) : "", [file]);

  const onFile = (next?: File) => {
    setNotice("");
    if (!next) return;
    if (!next.type.startsWith("image/")) { setNotice("Please select a JPG, PNG or WebP image."); return; }
    if (next.size > 10 * 1024 * 1024) { setNotice("The image must be 10 MB or smaller."); return; }
    const url = URL.createObjectURL(next);
    setPreview((old) => { if (old) URL.revokeObjectURL(old); return url; });
    setFile(next);
  };

  const reset = () => {
    setFile(null);
    setPreview((old) => { if (old) URL.revokeObjectURL(old); return ""; });
    if (fileRef.current) fileRef.current.value = "";
    setNotice("");
  };

  const requestGeneration = () => {
    if (!file || !consent) return;
    setNotice("Your selections are ready. The image-generation provider and secure generation endpoint have not yet been connected, so no image has been generated or uploaded. This screen is ready for that integration.");
  };

  return <main className="muse-face-page">
    <header className="muse-face-topbar">
      <button className="muse-back" onClick={() => navigate(-1)}><ArrowLeft size={17}/> Back</button>
      <div className="muse-brand"><span className="muse-brand-mark">M</span><span>MAGICREEL <small>FASHION INTELLIGENCE ENGINE</small></span></div>
      <span className="muse-phase-label">MUSE STUDIO · PHASE 1</span>
    </header>

    <div className="muse-face-heading">
      <div><span className="muse-eyebrow"><Sparkles size={14}/> CREATE YOUR VIRTUAL MODEL</span>
        <h1>Create your model's face</h1>
        <p>Start with one clear portrait. Shape the look, explore variations and choose the face that represents your brand.</p>
      </div>
      <div className="muse-stepper"><span className="active">1 <small>Face</small></span><i/><span>2 <small>Muse assets</small></span><i/><span>3 <small>Save Muse</small></span></div>
    </div>

    <div className="muse-face-workspace">
      <section className="muse-upload-card">
        <div className="muse-section-heading"><div><span className="muse-eyebrow">01 · SOURCE IMAGE</span><h2>Upload a portrait</h2><p>A passport-style head-and-shoulders photo works best.</p></div></div>
        {preview ? <div className="muse-source-preview">
          <img src={preview} alt="Uploaded source portrait preview"/>
          <div className="muse-source-overlay"><span><Check size={14}/> Image selected</span><button onClick={reset} aria-label="Remove image"><X size={16}/></button></div>
          <div className="muse-source-meta">{file?.name} · {fileSize} MB</div>
        </div> : <button className="muse-upload-drop" onClick={() => fileRef.current?.click()} onDragOver={(e) => { e.preventDefault(); }} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}>
          <span className="muse-upload-icon"><ImagePlus size={25}/></span><strong>Choose your source photo</strong><span>Click to browse or drag an image here</span><small>JPG, PNG or WebP · Maximum 10 MB</small>
        </button>}
        <input ref={fileRef} className="muse-hidden-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onFile(e.target.files?.[0])}/>
        <div className="muse-photo-guidelines"><strong>For the best result</strong><ul><li>One adult face, looking towards the camera</li><li>Head, neck and shoulders visible</li><li>Clear lighting; eyes and facial features unobstructed</li><li>Avoid heavy filters, sunglasses and group photos</li></ul></div>
        <div className="muse-upload-note"><Info size={15}/> No government passport document is needed. An ordinary phone portrait is fine.</div>
      </section>

      <section className="muse-controls-card">
        <div className="muse-section-heading"><div><span className="muse-eyebrow">02 · DESIGN YOUR FACE</span><h2>Choose the look</h2><p>Original is preserved wherever possible unless you choose to change it.</p></div></div>

        <div className="muse-control-block">
          <div className="muse-control-title"><label htmlFor="muse-age">Target age</label><strong>{age} <small>years</small></strong></div>
          <input id="muse-age" className="muse-age-slider" type="range" min="18" max="60" value={age} onChange={(e) => setAge(Number(e.target.value))}/>
          <div className="muse-range-labels"><span>18 years</span><span>60 years</span></div>
        </div>

        <div className="muse-control-block">
          <div className="muse-control-title"><label>Skin tone</label><span className="muse-muted">Original by default</span></div>
          <div className="muse-skin-row">{skinTones.map((tone) => <button type="button" key={tone.value} className={`muse-skin-option ${skinTone === tone.value ? "selected" : ""}`} onClick={() => setSkinTone(tone.value)} aria-label={tone.label} aria-pressed={skinTone === tone.value}><span style={{ background: tone.color }}/><small>{tone.label}</small></button>)}</div>
        </div>

        <div className="muse-control-block">
          <div className="muse-control-title"><label>Face shape</label><span className="muse-muted">Optional · Original default</span></div>
          <div className="muse-choice-grid two">{faceShapes.map((shape) => <Choice key={shape.value} value={shape.value} selected={faceShape} onSelect={setFaceShape} label={shape.label} detail={shape.detail}/>)}</div>
        </div>

        <div className="muse-control-block">
          <div className="muse-control-title"><label>Face texture</label><span className="muse-muted">Natural refinement default</span></div>
          <div className="muse-choice-grid two">{textures.map((item) => <Choice key={item.value} value={item.value} selected={texture} onSelect={setTexture} label={item.label} detail={item.detail}/>)}</div>
        </div>

        <div className="muse-control-block">
          <div className="muse-control-title"><label>Hairstyle</label></div>
          <div className="muse-choice-grid three">
            <Choice value="source" selected={hair} onSelect={setHair} label="Keep source"/>
            <Choice value="explore" selected={hair} onSelect={setHair} label="AI explore"/>
            <Choice value="specific" selected={hair} onSelect={setHair} label="Choose style"/>
          </div>
          {hair === "specific" && <select className="muse-select" value={specificHair} onChange={(e) => setSpecificHair(e.target.value)}><option>AI-selected</option><option>Short and natural</option><option>Medium length</option><option>Long and flowing</option><option>Curly</option><option>Wavy</option><option>Sleek</option></select>}
          <p className="muse-helper">With AI explore, hairstyle may vary between candidates while the selected face identity stays consistent.</p>
        </div>

        <div className="muse-control-block">
          <div className="muse-control-title"><label>Expression</label></div>
          <div className="muse-choice-grid four">{([{value:"natural",label:"Natural"},{value:"smile",label:"Gentle smile"},{value:"confident",label:"Confident"},{value:"editorial",label:"Editorial"}] as {value:Expression;label:string}[]).map(x => <Choice key={x.value} value={x.value} selected={expression} onSelect={setExpression} label={x.label}/>)}</div>
        </div>

        <details className="muse-advanced">
          <summary>Advanced creative direction <span>Optional</span></summary>
          <div className="muse-control-block">
            <div className="muse-control-title"><label>Identity transformation</label></div>
            <div className="muse-choice-grid three">
              <Choice value="preserve" selected={transformation} onSelect={setTransformation} label="Preserve resemblance" detail="Closer to source"/>
              <Choice value="distinctive" selected={transformation} onSelect={setTransformation} label="Distinctive identity" detail="Balanced change"/>
              <Choice value="reimagine" selected={transformation} onSelect={setTransformation} label="Reimagine" detail="New fictional look"/>
            </div>
          </div>
          <div className="muse-control-block">
            <div className="muse-control-title"><label>Appearance direction</label></div>
            <select className="muse-select" value={direction} onChange={(e) => setDirection(e.target.value)}><option value="original">Original / unrestricted</option><option value="indian-editorial">Indian fashion editorial</option><option value="korean-editorial">Korean fashion editorial</option><option value="western-editorial">Contemporary Western editorial</option><option value="mediterranean-editorial">Mediterranean-inspired editorial</option><option value="international-high-fashion">International high-fashion</option></select>
          </div>
        </details>

        <div className="muse-control-block muse-candidate-count">
          <div className="muse-control-title"><label>Face candidates</label><span className="muse-muted">Generated as separate images</span></div>
          <div className="muse-count-options">{[4,8,12].map((n) => <button type="button" key={n} onClick={() => setCount(n)} className={count === n ? "selected" : ""}>{n} <small>faces</small></button>)}</div>
        </div>

        <label className="muse-consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}/><span>I confirm that I have the right and necessary consent to use this photograph and the depicted person's likeness for AI-generated commercial fashion content.</span></label>
        <button className="muse-generate-button" disabled={!file || !consent} onClick={requestGeneration}><Sparkles size={17}/> Generate {count} face candidates</button>
        {notice && <div className="muse-status-note" role="status">{notice}</div>}
        <p className="muse-privacy-note">Your original photo should be handled as private personal data. Generation and storage will only be enabled after the secure provider workflow is connected.</p>
      </section>
    </div>
  </main>;
}
