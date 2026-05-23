import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ecomStudio.css";
import { API_BASE } from "../../config/api";

type World = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const ECOM_WORLDS: World[] = [
{
id:"marketplace",
title:"Marketplace",
description:"Clean, neutral backgrounds perfect for product listing",
image:"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto,w_900,c_fill,ar_16:9/v1779531647/marketplace-v1_vnksmv.jpg"
},
{
id:"product_studio",
title:"Product Studio",
description:"Premium studio setups for product showcase",
image:"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto,w_900,c_fill,ar_16:9/v1779531647/product-studio-v1_ituix0.jpg"
},
{
id:"lifestyle",
title:"Lifestyle",
description:"Real-life environments for brand storytelling",
image:"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto,w_900,c_fill,ar_16:9/v1779531647/lifestyle-v1_bqi17r.jpg"
},
{
id:"flat_catalog",
title:"Flat Catalog",
description:"Clean, flat lay style for catalog & e-commerce",
image:"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto,w_900,c_fill,ar_16:9/v1779531647/flat-catalog-v1_ytyltb.jpg"
},
{
id:"premium_brand",
title:"Premium Brand",
description:"High-end premium vibes for luxury branding",
image:"https://res.cloudinary.com/duaqfspwa/image/upload/f_auto,q_auto,w_900,c_fill,ar_16:9/v1779531647/premium-brand-v1_qvkw1t.jpg"
}
];

export default function EcomStudioPage(){

const location=useLocation();

const navigate=useNavigate();

const fileFrontRef=
useRef<HTMLInputElement|null>(null);

const fileBackRef=
useRef<HTMLInputElement|null>(null);

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

const[
frontHero,
setFrontHero
]=useState(
incomingFront
);

const[
backHero,
setBackHero
]=useState(
incomingBack
);

const[
selectedWorld,
setSelectedWorld
]=useState(
"marketplace"
);

const[
loading,
setLoading
]=useState(false);

const fromHero=
useMemo(
()=>!!incomingFront,
[incomingFront]
);

const uploadImage=(
e:any,
setter:any
)=>{
const file=
e.target.files?.[0];

if(!file)return;

const reader=
new FileReader();

reader.onload=()=>{
setter(
reader.result
);
};

reader.readAsDataURL(file);
};

async function handleGenerate(){

if(!frontHero){
alert(
"Front Hero required"
);
return;
}

try{

setLoading(true);

const token=
localStorage.getItem(
"token"
);

const res=
await fetch(
`${API_BASE}/api/p2m/ecom/generate-v1`,
{
method:"POST",

headers:{
"Content-Type":
"application/json",

Authorization:
`Bearer ${token}`
},

body:
JSON.stringify({

heroImageUrl:
frontHero,

backHeroImageUrl:
backHero||

undefined,

preset:
selectedWorld
})
}
);

const data=
await res.json();

navigate(
`/pack/ecom/output/${data.runId}`
);

}
catch{

alert(
"Generation failed"
);

}

setLoading(false);

}

return (

<div className="ecom-page">

<div className="ecom-container">

<div className="mini-top">
✦ MAGICREEL AI STUDIO ✦
</div>

<h1>
E-COM Studio
</h1>

<p className="subtitle">
Create conversion-ready e-commerce image packs
using AI poses and curated presentation worlds.
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
onClick={() => fileFrontRef.current?.click()}
>

{frontHero ? (

<img
src={frontHero}
alt=""
/>

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

<button
onClick={() =>
fileFrontRef.current?.click()
}
>
{frontHero
? "Change Image"
: "Upload Image"}
</button>

<input
hidden
ref={fileFrontRef}
type="file"
onChange={(e)=>
uploadImage(
e,
setFrontHero
)}
/>

</div>



{/* BACK */}

<div className="hero-card">

<div className="card-title">
2. BACK HERO IMAGE (OPTIONAL)
</div>

<div
className="preview-large"
onClick={() =>
fileBackRef.current?.click()
}
>

{backHero ? (

<img
src={backHero}
alt=""
/>

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

<button
onClick={() =>
fileBackRef.current?.click()
}
>
{backHero
? "Change Image"
: "Upload Image"}
</button>

<input
hidden
ref={fileBackRef}
type="file"
onChange={(e)=>
uploadImage(
e,
setBackHero
)}
/>

</div>

</div>



<div className="section-title">
3. CHOOSE E-COM WORLD
</div>


<div className="world-grid">

{ECOM_WORLDS.map((world)=>(

<div
key={world.id}
className={`world-card ${
selectedWorld===world.id
? "selected"
: ""
}`}
onClick={() =>
setSelectedWorld(world.id)
}
>

<img
src={world.image}
alt=""
/>

<div className="world-content">

<h3>
{world.title}
</h3>

<p>
{world.description}
</p>

</div>

</div>

))}

</div>


<div className="benefits">

<div>
4–5 High Quality E-COM Images
</div>

<div>
Different Poses & Angles
</div>

<div>
Consistent Look & Identity
</div>

<div>
Ready To Use For Store
</div>

</div>


<button
className="generate-btn"
disabled={loading}
onClick={handleGenerate}
>

{loading
? "Generating..."
: "Generate E-COM Pack (2 Credits)"}

</button>

</div>

</div>

);
}