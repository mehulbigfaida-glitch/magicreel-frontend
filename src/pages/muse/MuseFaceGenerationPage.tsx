import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ImagePlus, Info, Sparkles, X } from "lucide-react";
import "./MuseFaceGenerationPage.css";

type Gender = "auto" | "female" | "male";

const MASTER_PROMPT = `# MAGICREEL – DISTINCTIVE MUSE GENERATION
## Eight Unique Virtual Fashion Model Identities

### PRIMARY OBJECTIVE
Use the uploaded photograph as a source of visual inspiration to create EIGHT DISTINCTIVE, FICTIONAL, {{AGE}}-YEAR-OLD ADULT FASHION MODEL IDENTITIES.
This is a creative identity transformation task, NOT a conventional portrait retouching, beautification or hairstyle-changing task.
The objective is to create eight different virtual fashion models who retain a broad visual connection to the reference person but do NOT look like photographic replicas or simply younger versions of the original person.

### 1. REFERENCE IMAGE ANALYSIS
Study the uploaded photograph and identify:
- Broad facial character.
- General facial proportions.
- Natural skin-tone family.
- Hair-colour characteristics.
- General visual appearance.
Use these as broad creative reference characteristics.
Do not attempt to reproduce the exact facial geometry of the original person.

### 2. FACIAL IDENTITY TRANSFORMATION
This is the most important instruction.
Create a NEW and DISTINCTIVE fictional fashion-model face inspired by the reference photograph.
Retain broad visual characteristics, but introduce meaningful and harmonious changes to:
- Eye shape, definition and appearance.
- Eyebrow structure.
- Nose shape and detailing.
- Lip shape and proportions.
- Cheekbone definition.
- Chin and jawline detailing.
- Facial proportions and feature relationships.
The resulting face must look like a professionally developed fashion-model identity rather than an edited photograph of the original person.
Do not make all eight faces identical. Each candidate must have its own distinctive facial design.
Avoid extreme facial distortion, exaggerated beauty standards, artificial symmetry and plastic-looking skin.

### 3. AGE TRANSFORMATION
Every model must appear approximately {{AGE}} years old.
Create a convincing adult appearance appropriate to the selected age. Reconstruct age-appropriate facial characteristics naturally rather than merely smoothing wrinkles or applying a beauty filter.
Do not make the models look like teenagers or children.

### 4. COMMON APPEARANCE REQUIREMENTS
- Retain the broad skin-tone family of the reference person.
- Hair colour should remain broadly consistent unless a particular editorial treatment calls for a subtle variation.
- Create appropriate hairstyles for each fashion direction.
- Use natural, realistic skin texture.
- Use professional fashion-model grooming.
- Create attractive, harmonious and distinctive facial features.
- Maintain photorealism.

### 5. GENERATE EIGHT DIFFERENT FASHION-MODEL IDENTITIES
IMAGE 1 – INDIAN CONTEMPORARY FASHION MODEL
A sophisticated contemporary Indian fashion-editorial aesthetic. Refined facial features, expressive eyes, balanced proportions, elegant grooming and versatile commercial-fashion appeal.

IMAGE 2 – KOREAN CONTEMPORARY FASHION MODEL
Inspired by contemporary Korean fashion campaigns. Polished grooming, sophisticated facial detailing, clean styling, refined makeup and elegant presentation.

IMAGE 3 – AMERICAN COMMERCIAL FASHION MODEL
A confident international commercial-fashion appearance. Distinctive facial character, expressive eyes, contemporary grooming and strong campaign presence.

IMAGE 4 – AUSTRALIAN FASHION MODEL
A fresh, naturally sophisticated appearance. Relaxed editorial grooming, effortless hairstyle, natural skin presentation and confident youthful character.

IMAGE 5 – MEDITERRANEAN FASHION MODEL
Warm, sophisticated editorial aesthetics. Harmonious facial features, expressive eyes, defined facial detailing and elegant contemporary grooming.

IMAGE 6 – EUROPEAN HIGH-FASHION MODEL
A refined luxury-fashion appearance. Distinctive facial structure, sophisticated proportions, minimalist grooming and premium designer-campaign aesthetics.

IMAGE 7 – EAST ASIAN CONTEMPORARY FASHION MODEL
A modern editorial appearance with sophisticated grooming, carefully balanced facial detailing, elegant presentation and distinctive visual character.

IMAGE 8 – INTERNATIONAL RUNWAY FASHION MODEL
A bold and distinctive high-fashion identity. More experimental facial styling, striking editorial character, sophisticated grooming and memorable runway presence.

### 6. DIFFERENTIATION REQUIREMENT
The eight outputs must represent EIGHT DIFFERENT FICTIONAL FACES.
Do not generate eight versions of the same face with different hairstyles, clothing, facial hair, makeup or lighting.
Introduce meaningful differences in facial feature design between the candidates while retaining broad visual inspiration from the source.
Do not copy any identifiable celebrity, public figure or existing fashion model.

### 7. PORTRAIT COMPOSITION
Generate each model as an individual professional fashion-editorial portrait.
- Straight-on, front-facing view.
- Head and shoulders visible.
- Eyes looking directly into the camera.
- Natural, confident expression.
- Simple, neutral studio background.
- Consistent camera angle and portrait scale.
- No hats, scarves, sunglasses or distracting accessories.
- No elaborate costumes.
- Simple, understated clothing.
- Face must remain the primary subject.

### 8. FINAL COLLAGE
Create ONE high-resolution collage containing exactly eight individual portraits.
Layout: 4 columns × 2 rows.
Each cell must contain one complete portrait.
All eight portraits must have equal dimensions and consistent framing.
Maintain clean separation between the images.
Do not overlap or merge portraits.
Do not repeat faces.
Do not crop heads, chins or shoulders.
Do not include text, numbers, captions, logos or watermarks.

### FINAL QUALITY TEST
Before producing the final collage, ensure:
1. All eight models look approximately {{AGE}} years old.
2. All eight have genuinely different facial identities.
3. Each face has meaningful facial-feature refinement, not merely a hairstyle change.
4. The models retain broad visual inspiration from the reference.
5. Skin tone and natural appearance remain plausible.
6. Each model looks suitable for professional commercial fashion photography.
7. The result does not resemble eight photographs of the original person.

### FINAL CREATIVE DIRECTION
Think of this as a premium fashion agency creating eight new virtual model identities inspired by one person's photograph.
The reference person is the inspiration, not the identity to be copied.
Create eight distinctive, attractive, photorealistic virtual fashion models.`;

export function buildMusePrompt(age: number, gender: Gender) {
  const genderInstruction = gender === "auto" ? "" : `\n\n### OPTIONAL GENDER PRESENTATION\nCreate the fictional fashion-model identities with a ${gender} presentation, while retaining broad visual inspiration from the uploaded reference.`;
  return MASTER_PROMPT.replaceAll("{{AGE}}", String(age)) + genderInstruction;
}

export default function MuseFaceGenerationPage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<Gender>("auto");
  const [consent, setConsent] = useState(false);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const onFile = (next?: File) => {
    setNotice("");
    if (!next) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(next.type)) { setNotice("Please select a JPG, PNG or WebP image."); return; }
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

  const requestGeneration = async () => {
    if (!file || !consent || busy) return;
    setBusy(true);
    setNotice("");
    try {
      const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const form = new FormData();
      form.append("image", file);
      const uploadResponse = await fetch(`${base}/api/muse/upload-reference`, { method: "POST", body: form, credentials: "include" });
      if (!uploadResponse.ok) throw new Error("Reference photo upload failed. Please try again.");
      const uploaded = await uploadResponse.json();
      const referenceImageUrl = uploaded?.data?.imageUrl || uploaded?.imageUrl;
      if (!referenceImageUrl) throw new Error("The upload response did not include an image URL.");
      const generationResponse = await fetch(`${base}/api/muse/generate-faces`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceImageUrl, age, gender, prompt: buildMusePrompt(age, gender), candidateCount: 8, layout: "4x2", promptVersion: "distinctive-muse-v1" })
      });
      const generated = await generationResponse.json().catch(() => ({}));
      if (!generationResponse.ok) throw new Error(generated?.message || "Muse generation could not be started.");
      setNotice("Generation request accepted. Your eight-face collage is being prepared.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
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
        <p>Upload one portrait, choose an age and explore eight distinctive fictional fashion-model identities.</p>
      </div>
      <div className="muse-stepper"><span className="active">1 <small>Face</small></span><i/><span>2 <small>Muse assets</small></span><i/><span>3 <small>Save Muse</small></span></div>
    </div>
    <div className="muse-face-workspace">
      <section className="muse-upload-card">
        <div className="muse-section-heading"><div><span className="muse-eyebrow">01 · SOURCE IMAGE</span><h2>Upload a portrait</h2><p>A clear adult head-and-shoulders photo works best.</p></div></div>
        {preview ? <div className="muse-source-preview">
          <img src={preview} alt="Uploaded source portrait preview"/>
          <div className="muse-source-overlay"><span><Check size={14}/> Image selected</span><button onClick={reset} aria-label="Remove image"><X size={16}/></button></div>
          <div className="muse-source-meta">{file?.name} · {(file!.size / (1024 * 1024)).toFixed(1)} MB</div>
        </div> : <button className="muse-upload-drop" onClick={() => fileRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}>
          <span className="muse-upload-icon"><ImagePlus size={25}/></span><strong>Choose your source photo</strong><span>Click to browse or drag an image here</span><small>JPG, PNG or WebP · Maximum 10 MB</small>
        </button>}
        <input ref={fileRef} className="muse-hidden-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onFile(e.target.files?.[0])}/>
        <div className="muse-photo-guidelines"><strong>For the best result</strong><ul><li>One adult face, looking towards the camera</li><li>Head, neck and shoulders visible</li><li>Clear lighting; eyes and facial features unobstructed</li><li>Avoid heavy filters, sunglasses and group photos</li></ul></div>
        <div className="muse-upload-note"><Info size={15}/> An ordinary phone portrait is fine. No passport document is needed.</div>
      </section>
      <section className="muse-controls-card">
        <div className="muse-section-heading"><div><span className="muse-eyebrow">02 · PERSONALISE</span><h2>Set your model preferences</h2><p>We take care of the creative direction and all eight fashion identities.</p></div></div>
        <div className="muse-control-block">
          <div className="muse-control-title"><label htmlFor="muse-age">Target age</label><strong>{age} <small>years</small></strong></div>
          <input id="muse-age" className="muse-age-slider" type="range" min="18" max="60" value={age} onChange={(e) => setAge(Number(e.target.value))}/>
          <div className="muse-range-labels"><span>18 years</span><span>60 years</span></div>
        </div>
        <div className="muse-control-block">
          <div className="muse-control-title"><label>Gender presentation</label><span className="muse-muted">Optional</span></div>
          <div className="muse-choice-grid three">
            {(["auto", "female", "male"] as Gender[]).map((g) => <button type="button" key={g} className={`muse-choice ${gender === g ? "is-selected" : ""}`} onClick={() => setGender(g)} aria-pressed={gender === g}><span className="muse-choice-check">{gender === g ? <Check size={13}/> : null}</span><span><strong>{g === "auto" ? "Auto detect" : g === "female" ? "Female" : "Male"}</strong><small>{g === "auto" ? "Use the reference" : ` ${g} presentation`}</small></span></button>)}
          </div>
        </div>
        <div className="muse-candidate-summary"><span className="muse-candidate-icon"><Sparkles size={18}/></span><div><strong>8 distinctive Muse candidates</strong><p>One high-resolution collage · 4 columns × 2 rows</p></div><span className="muse-fixed-count">8</span></div>
        <label className="muse-consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}/><span>I confirm that I have the right and necessary consent to use this photograph and the depicted adult person's likeness for AI-generated commercial fashion content.</span></label>
        <button className="muse-generate-button" disabled={!file || !consent || busy} onClick={requestGeneration}><Sparkles size={17}/>{busy ? "Preparing generation…" : "Generate My Muses"}</button>
        {notice && <div className="muse-status-note" role="status">{notice}</div>}
        <p className="muse-privacy-note">Your source photo is used as a visual reference for this generation. It is not a public profile image.</p>
      </section>
    </div>
  </main>;
}
