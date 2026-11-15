import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, ExternalLink, FileJson, Printer, ShieldCheck } from "lucide-react";
import { API_BASE } from "../../config/api";
import "./MuseIdentityCertificatePage.css";

type MuseData = { id: string; name: string; age: number; gender: string; candidateNumber: number; masterPortraitUrl: string; placeholderImageUrl: string; processingImageUrl: string; processingBackImageUrl: string; status: string; createdAt: string };
type EvidenceData = { certificateId: string; status: string; issuedAt: string; manifest: Record<string, any>; manifestHash: string; signature: string | null; publicKeyPem: string | null; signingKeyId: string | null; consent: Record<string, any> | null; visualEvidence?: { sourceReferenceUrl: string | null; selectedIdentityUrl: string | null; finalMuseUrl: string | null }; legalNotice: string };

const api = API_BASE.replace(/\/$/, "");

export default function MuseIdentityCertificatePage() {
  const { id } = useParams();
  const [muse, setMuse] = useState<MuseData | null>(null);
  const [evidence, setEvidence] = useState<EvidenceData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");
    if (!token || !id) { setError("Please sign in to view this private certificate."); setLoading(false); return; }
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${api}/api/muse/my-muses/${encodeURIComponent(id)}`, { headers, credentials: "include" }),
      fetch(`${api}/api/muse/my-muses/${encodeURIComponent(id)}/provenance`, { headers, credentials: "include" })
    ]).then(async ([museResponse, evidenceResponse]) => {
      const [museJson, evidenceJson] = await Promise.all([museResponse.json(), evidenceResponse.json()]);
      if (!museResponse.ok) throw new Error(museJson?.message || "Could not load this Muse.");
      if (!evidenceResponse.ok) throw new Error(evidenceJson?.message || "Private evidence export is unavailable.");
      if (!active) return;
      setMuse(museJson?.data?.muse || null);
      setEvidence(evidenceJson?.data || null);
    }).catch((e) => { if (active) setError(e instanceof Error ? e.message : "Certificate could not be loaded."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const downloadJson = () => {
    if (!evidence || !muse) return;
    const payload = { documentType: "MagicReel AI Model Identity & Provenance Evidence", issuer: { platform: "MagicReel", proposedLegalEntity: "AMJIS LABS PRIVATE LIMITED", registeredOffice: "136/15, Manilal Mansion, I. D. Bhuva Marg, Wadala, Mumbai - 400031, Maharashtra, India", issuerActivation: "Pending confirmation against certificate of incorporation and registered-office records" }, muse, evidence };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `MagicReel-Muse-Evidence-${evidence.certificateId}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <main className="muse-cert-page"><div className="muse-cert-loading">Loading your private Muse evidence…</div></main>;
  if (error || !muse || !evidence) return <main className="muse-cert-page"><div className="muse-cert-error"><strong>Certificate unavailable</strong><p>{error || "The requested certificate could not be found."}</p><Link to="/create-muse/face">Return to Muse Studio</Link></div></main>;

  const verificationUrl = `${api}/api/muse/verify/${encodeURIComponent(evidence.certificateId)}`;
  const signed = Boolean(evidence.signature && evidence.publicKeyPem);
  const visual = evidence.visualEvidence || {};

  return <main className="muse-cert-page">
    <nav className="muse-cert-nav"><Link to="/create-muse/face"><ArrowLeft size={16}/> Back to Muse Studio</Link><span>MAGICREEL · VERIFIED AI MODEL</span></nav>
    <article className="muse-cert-document">
      <header className="muse-cert-header">
        <div className="muse-cert-brand"><span className="muse-cert-mark">M</span><div><strong>MAGICREEL</strong><small>FASHION INTELLIGENCE ENGINE</small></div></div>
        <div className="muse-cert-kicker">AI MODEL IDENTITY & PROVENANCE</div>
        <h1>Model Identity Certificate</h1>
        <p className="muse-cert-subtitle">A verifiable record of the creation history and recorded assets of this AI-generated fashion model.</p>
        <div className="muse-cert-status"><ShieldCheck size={17}/>{signed ? "DIGITALLY SIGNED · PROVISIONAL" : "UNSIGNED · PROVISIONAL"}</div>
      </header>

      <section className="muse-cert-visuals">
        <figure><div className="muse-cert-image">{visual.sourceReferenceUrl ? <img src={visual.sourceReferenceUrl} alt="Original source photograph"/> : <div className="muse-cert-image-missing">Source image unavailable</div>}</div><figcaption><b>01 · Original reference</b><span>Photograph supplied for this creation workflow</span></figcaption></figure>
        <figure><div className="muse-cert-image">{visual.selectedIdentityUrl ? <img src={visual.selectedIdentityUrl} alt="Selected AI identity candidate"/> : <div className="muse-cert-image-missing">Selected identity unavailable</div>}</div><figcaption><b>02 · Selected identity</b><span>Candidate {muse.candidateNumber} selected from the generated set</span></figcaption></figure>
        <figure><div className="muse-cert-image">{visual.finalMuseUrl || muse.placeholderImageUrl ? <img src={visual.finalMuseUrl || muse.placeholderImageUrl} alt="Final MagicReel Muse"/> : <div className="muse-cert-image-missing">Final Muse unavailable</div>}</div><figcaption><b>03 · Registered Muse</b><span>Final reusable AI fashion-model identity</span></figcaption></figure>
      </section>

      <section className="muse-cert-facts">
        <div><span>Muse name</span><strong>{muse.name}</strong></div>
        <div><span>Certificate ID</span><strong>{evidence.certificateId}</strong></div>
        <div><span>Creation date</span><strong>{new Date(muse.createdAt).toLocaleString()}</strong></div>
        <div><span>Certificate issued</span><strong>{new Date(evidence.issuedAt).toLocaleString()}</strong></div>
        <div><span>Selected candidate</span><strong>#{muse.candidateNumber}</strong></div>
        <div><span>Recorded status</span><strong>{evidence.status}</strong></div>
      </section>

      <section className="muse-cert-integrity">
        <h2>Digital integrity & verification</h2>
        <div><span>Provenance manifest · SHA-256</span><code>{evidence.manifestHash}</code></div>
        <div><span>Signing key ID</span><code>{evidence.signingKeyId || "Not available"}</code></div>
        <div><span>Signature</span><strong>{signed ? "Ed25519 signature recorded" : "No digital signature recorded"}</strong></div>
        <a href={verificationUrl} target="_blank" rel="noreferrer">Open independent public verification record <ExternalLink size={14}/></a>
      </section>

      <section className="muse-cert-issuer">
        <h2>Certificate programme & proposed issuer</h2>
        <strong>MagicReel · AI Model & Content Provenance</strong>
        <b>AMJIS LABS PRIVATE LIMITED</b>
        <p>Proposed registered office: 136/15, Manilal Mansion, I. D. Bhuva Marg, Wadala, Mumbai - 400031, Maharashtra, India.</p>
        <small>Issuer activation is pending confirmation against the company's Certificate of Incorporation and registered-office records. This preview must not be represented as a company-issued legal certificate until that verification is complete.</small>
      </section>

      <footer className="muse-cert-legal">
        <strong>Scope and limitations</strong>
        <p>This issuer-created record documents the creation workflow, recorded consent declaration and integrity fingerprints held by MagicReel. A valid digital signature confirms the integrity of the recorded manifest; it does not independently establish identity, authorship, copyright ownership, consent beyond the recorded declaration, exclusive rights in a facial identity, or acceptance by any marketplace. This is not statutory intellectual-property registration or a legal opinion. Marketplace requirements and applicable rights must be assessed separately.</p>
      </footer>
      <div className="muse-cert-actions no-print">
        <button onClick={() => window.print()}><Printer size={16}/> Print / Save as PDF</button>
        <button onClick={downloadJson}><FileJson size={16}/> Download evidence JSON</button>
      </div>
    </article>
  </main>;
}
