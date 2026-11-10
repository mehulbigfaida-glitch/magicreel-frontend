import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ImagePlus, Info, Sparkles, X } from "lucide-react";
import "./MuseFaceGenerationPage.css";
import { API_BASE } from "../../config/api";

type Gender = "auto" | "female" | "male";

type MuseCandidate = { candidateNumber: number; imageUrl: string; publicId: string; width?: number; height?: number };
type SavedMuse = { id: string; name: string; masterPortraitUrl: string; placeholderImageUrl: string; processingImageUrl: string; processingBackImageUrl: string; status: string; };

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
  const [referencePublicId, setReferencePublicId] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [candidates, setCandidates] = useState<MuseCandidate[]>([]);
  const [selectedCandidateNumber, setSelectedCandidateNumber] = useState<number | null>(null);
  const [museName, setMuseName] = useState("My Muse");
  const [savingMuse, setSavingMuse] = useState(false);
  const [savedMuse, setSavedMuse] = useState<SavedMuse | null>(null);

  const onFile = (next?: File) => {
    setNotice("");
    setReferencePublicId("");
    setGeneratedImageUrl("");
    setCandidates([]);
    setSelectedCandidateNumber(null);
    sessionStorage.removeItem("magicreel.muse.candidates");
    sessionStorage.removeItem("magicreel.selectedMuseCandidate");
    if (!next) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(next.type)) { setNotice("Please select a JPG, PNG or WebP image."); return; }
    if (next.size > 10 * 1024 * 1024) { setNotice("The image must be 10 MB or smaller."); return; }
    const url = URL.createObjectURL(next);
    setPreview((old) => { if (old) URL.revokeObjectURL(old); return url; });
    setFile(next);
  };

  const reset = () => {
    setFile(null);
    setReferencePublicId("");
    setGeneratedImageUrl("");
    setCandidates([]);
    setSelectedCandidateNumber(null);
    sessionStorage.removeItem("magicreel.muse.candidates");
    sessionStorage.removeItem("magicreel.selectedMuseCandidate");
    setPreview((old) => { if (old) URL.revokeObjectURL(old); return ""; });
    if (fileRef.current) fileRef.current.value = "";
    setNotice("");
  };

  const requestGeneration = async () => {
    if (!file || !consent || busy) return;
    setBusy(true);
    setNotice("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Your session has expired. Please sign in again.");
      const apiBase = API_BASE.replace(/\/$/, "");

      // First action uploads the reference only. Generation requires a second, explicit click.
      if (!referencePublicId) {
        const form = new FormData();
        form.append("image", file);
        const uploadResponse = await fetch(`${apiBase}/api/muse/upload-reference`, {
          method: "POST",
          body: form,
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });
        const uploaded = await uploadResponse.json().catch(() => ({}));
        if (!uploadResponse.ok) {
          throw new Error(uploaded?.message || "Reference photo upload failed. Please try again.");
        }
        const publicId = uploaded?.data?.publicId;
        if (!publicId) throw new Error("The upload response did not include a reference ID.");
        setReferencePublicId(publicId);
        setNotice("Reference photo uploaded successfully. Click Generate My Muses again when you are ready to create the eight faces.");
        return;
      }

      const generationResponse = await fetch(`${apiBase}/api/muse/generate-faces`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ referencePublicId, age, gender, consent: true }),
      });
      const generated = await generationResponse.json().catch(() => ({}));
      if (!generationResponse.ok) {
        throw new Error(generated?.message || "Muse generation failed. Please try again.");
      }
      const imageUrl = generated?.data?.imageUrl;
      const extractedCandidates = generated?.data?.candidates;
      if (!imageUrl) throw new Error("Generation completed without returning a collage image.");
      if (!Array.isArray(extractedCandidates) || extractedCandidates.length !== 8 || extractedCandidates.some((candidate) => !candidate?.imageUrl || !candidate?.publicId)) {
        throw new Error("The collage was generated, but eight individual candidate portraits were not returned. Please contact support before retrying.");
      }
      setGeneratedImageUrl(imageUrl);
      setCandidates(extractedCandidates);
      sessionStorage.setItem("magicreel.muse.candidates", JSON.stringify({
        age,
        gender,
        promptVersion: "distinctive-muse-v1",
        candidates: extractedCandidates,
      }));
      sessionStorage.removeItem("magicreel.selectedMuseCandidate");
      setSelectedCandidateNumber(null);
      setNotice("Your eight Muse faces have been generated and separated into individual candidates. Select your preferred Muse.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const createSelectedMuse = async () => {
    if (savingMuse || selectedCandidateNumber === null) return;
    const selectedCandidate = candidates.find((candidate) => candidate.candidateNumber === selectedCandidateNumber);
    if (!selectedCandidate) { setNotice("Please select one of the eight Muse faces first."); return; }
    setSavingMuse(true);
    setNotice("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Your session has expired. Please sign in again.");
      const apiBase = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
      const response = await fetch(`${apiBase}/api/muse/create-from-candidate`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ candidatePublicId: selectedCandidate.publicId, candidateNumber: selectedCandidate.candidateNumber, age, gender, consent: true, name: museName.trim() || `My Muse ${selectedCandidate.candidateNumber}` }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.message || "Could not create your Muse. Please try again.");
      if (!result?.data?.id || !result?.data?.placeholderImageUrl || !result?.data?.processingImageUrl || !result?.data?.processingBackImageUrl || !result?.data?.masterPortraitUrl) {
        throw new Error("Muse generation completed without all four required assets. Please contact support before retrying.");
      }
      setSavedMuse(result.data as SavedMuse);
      setNotice("Your four Muse assets have been generated and saved to your private account.");
      sessionStorage.removeItem("magicreel.selectedMuseCandidate");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Muse asset generation failed. Please try again.");
    } finally { setSavingMuse(false); }
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
        <button className="muse-generate-button" disabled={!file || !consent || busy} onClick={requestGeneration}><Sparkles size={17}/>{busy ? "Preparing…" : referencePublicId ? "Generate My Muses" : "Upload Reference Photo"}</button>
        {notice && <div className="muse-status-note" role="status">{notice}</div>}
        {generatedImageUrl && <div className="muse-generated-result">
          <div className="muse-result-heading"><strong>Choose your Muse</strong><span>8 individual candidates</span></div>
          <div className="muse-candidate-grid">
            {candidates.map((candidate) => <button
              type="button"
              key={candidate.candidateNumber}
              className={`muse-candidate-card ${selectedCandidateNumber === candidate.candidateNumber ? "is-selected" : ""}`}
              onClick={() => {
                setSelectedCandidateNumber(candidate.candidateNumber);
                sessionStorage.setItem("magicreel.selectedMuseCandidate", JSON.stringify({
                  ...candidate,
                  age,
                  gender,
                  promptVersion: "distinctive-muse-v1",
                }));
              }}
              aria-pressed={selectedCandidateNumber === candidate.candidateNumber}
            >
              <img src={candidate.imageUrl} alt={`Muse candidate ${candidate.candidateNumber}`} />
              <span className="muse-candidate-card-footer">
                <strong>Muse {candidate.candidateNumber}</strong>
                <span>{selectedCandidateNumber === candidate.candidateNumber ? "Selected" : "Select"}</span>
              </span>
            </button>)}
          </div>
          {selectedCandidateNumber !== null && <div className="muse-selection-note" role="status">
            Muse {selectedCandidateNumber} selected. Your choice is saved in this browser session for the next Muse Studio step.
          </div>}
          <details className="muse-original-collage">
            <summary>View original 8-face collage</summary>
            <img src={generatedImageUrl} alt="Original eight-face Muse generation collage" />
          </details>
        </div>}
        {selectedCandidateNumber !== null && !savedMuse && <div className="muse-save-panel">
          <label className="muse-name-field">Name your Muse
            <input value={museName} maxLength={48} onChange={(event) => setMuseName(event.target.value)} placeholder="e.g. Anaya" />
          </label>
          <button className="muse-generate-button" disabled={savingMuse} onClick={createSelectedMuse}>
            <Sparkles size={17}/>{savingMuse ? "Creating four Muse assets…" : "Create My Muse"}
          </button>
          <p className="muse-helper">This creates the master portrait, customer-facing placeholder, front Hero and back Hero using the selected face.</p>
        </div>}
        {savedMuse && <section className="muse-saved-assets" aria-live="polite">
          <div className="muse-result-heading"><strong>{savedMuse.name} is ready</strong><span>4 assets saved</span></div>
          <div className="muse-saved-assets-grid">
            <figure><img src={savedMuse.masterPortraitUrl} alt="Master Muse portrait"/><figcaption>Master Muse Portrait</figcaption></figure>
            <figure><img src={savedMuse.placeholderImageUrl} alt="Muse placeholder in blue T-shirt"/><figcaption>Customer Placeholder</figcaption></figure>
            <figure><img src={savedMuse.processingImageUrl} alt="Front Hero reference"/><figcaption>Front Hero</figcaption></figure>
            <figure><img src={savedMuse.processingBackImageUrl} alt="Back Hero reference"/><figcaption>Back Hero</figcaption></figure>
          </div>
          <button className="muse-generate-button" onClick={() => navigate("/create-ai-hero")}>Use My Muse in MagicReel</button>
        </section>}
        <p className="muse-privacy-note">Your source photo is used as a visual reference for this generation. It is not a public profile image.</p>
      </section>
    </div>
  </main>;
}
