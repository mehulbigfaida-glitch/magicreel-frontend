import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ecomStudio.css";
import { API_BASE } from "../../config/api";
import LookbookHeroPickerModal from "./LookbookHeroPickerModal";
import { useNavigate } from "react-router-dom";

export default function EcomStudioPage(){

const location=useLocation();

const navigate = useNavigate();

const params=
new URLSearchParams(
location.search
);



const incomingFront=
location.state?.heroImageUrl||
params.get("hero")||
"";

const incomingBack=
location.state?.backHeroImageUrl||
params.get("back")||
"";

const incomingGender =
  location.state?.gender ||
  params.get("gender") ||
  "";

const incomingCategory =
  location.state?.category ||
  params.get("category") ||
  "";

const[
frontHero,
setFrontHero
]=useState(
incomingFront
);

const[
backHero
]=useState(
incomingBack
);

const selectedStyle = "studio";

const[
loading,
setLoading
]=useState(false);

const[
loadingMessage,
setLoadingMessage
]=useState("");

const[
elapsedTime,
setElapsedTime
]=useState(0);

const[
heroPickerOpen,
setHeroPickerOpen
]=useState(false);

const fromHero=
useMemo(
()=>!!incomingFront,
[incomingFront]
);

async function handleGenerate(){

if (!frontHero) {
  alert(
    "Please select a Front Hero from your Assets."
  );
  return;
}

let timer: ReturnType<typeof setInterval> | undefined;

try{

setLoading(true);

setElapsedTime(0);

setLoadingMessage(
"✨ Understanding Garment..."
);

const start = Date.now();

timer = setInterval(() => {

const seconds =
Math.floor(
(Date.now() - start) / 1000
);

setElapsedTime(seconds);

if (seconds <= 30) {

setLoadingMessage(
"✨ Understanding Garment..."
);

}
else if (seconds <= 60) {

setLoadingMessage(
"🎨 Creating Editorial Looks..."
);

}
else if (seconds <= 90) {

setLoadingMessage(
"☁️ Processing High-Resolution Images..."
);

}
else {

setLoadingMessage(
"✅ Finalizing Lookbook..."
);

}

},1000);

const token=
localStorage.getItem(
"token"
);

const res=
await fetch(
`${API_BASE}/api/p2m/lookbook-v1/generate`,
{
method:"POST",

headers:{
"Content-Type":
"application/json",

Authorization:
`Bearer ${token}`
},

body: JSON.stringify({

heroImageUrl: frontHero,

backHeroImageUrl: backHero || undefined,

lookbookStyle: selectedStyle,

gender: incomingGender,

category: incomingCategory,

})
}
);

const data = await res.json();

if (!res.ok) {

  console.error(data);

  alert(
    data.error || "Lookbook generation failed"
  );

  return;
}

if (timer) {
  clearInterval(timer);
}

navigate(
  `/pack/ecom/output/${data.runId}`
);
}
catch{

if (timer) {
  clearInterval(timer);
}

alert(
"Generation failed"
);

}

setLoading(false);

}

return (
<>
<div className="ecom-page">

<div className="ecom-container">

<div className="mini-top">
✦ MAGICREEL AI STUDIO ✦
</div>

<h1>
Lookbook Studio
</h1>

<p className="subtitle">
Create premium fashion lookbooks with AI-generated commercial fashion poses.
</p>

<div className="hero-grid">

{/* FRONT */}

<div className="hero-card">

<div className="card-title">
1. FRONT HERO IMAGE
</div>

{fromHero && (
<div className="linked-badge">
✓ Linked from Hero
</div>
)}

<div
  className="preview-large"
  onClick={() => setHeroPickerOpen(true)}
>

{frontHero ? (

<img src={frontHero} alt="" />

) : (

<div className="upload-center">

<div className="upload-circle">
↑
</div>

<div>
Upload front hero image
</div>

<div className="upload-text">
Required
</div>

</div>

)}

</div>

</div>

<div className="hero-card">

<div className="card-title">
{backHero
  ? "2. BACK HERO IMAGE ✓"
  : "2. BACK HERO IMAGE (OPTIONAL)"}
</div>

<div
  className="preview-large"
  onClick={() => setHeroPickerOpen(true)}
>

{backHero ? (

<img src={backHero} alt="" />

) : (

<div className="upload-center">

<div className="upload-circle">
↑
</div>

<div>
Upload back image
</div>

<div className="upload-text">
Recommended
</div>

</div>

)}

</div>


</div>

</div>

<button
className="generate-btn"
disabled={loading}
onClick={handleGenerate}
>

{loading ? (

<div className="generate-loading">

<div className="generate-timer">

⏳ {Math.floor(elapsedTime/60)}
:
{String(elapsedTime%60).padStart(2,"0")}

</div>

<div className="generate-status">

{loadingMessage}

</div>

</div>

) : (

"Generate Lookbook Pack (2 Credits)"

)}

</button>

</div>

</div>

<LookbookHeroPickerModal
  open={heroPickerOpen}
  onClose={() => setHeroPickerOpen(false)}
  onSelect={(url) => {
  setFrontHero(url);
  setHeroPickerOpen(false);
}}
/>//

</>
);
}