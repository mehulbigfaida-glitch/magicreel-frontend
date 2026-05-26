import { useEffect,useMemo,useState } from "react";
import { useParams } from "react-router-dom";

import "./ecomOutput.css";

const API_BASE =
import.meta.env.VITE_API_BASE_URL ||
import.meta.env.VITE_API_URL;

export default function EcomOutputPage(){

const { id }=useParams();

const [loading,setLoading]=
useState(true);

const [poses,setPoses]=
useState<any[]>([]);

useEffect(()=>{

async function load(){

try{

const res=
await fetch(
`${API_BASE}/api/p2m/lookbook/${id}`
);

const data=
await res.json();

console.log(
"LOOKBOOK:",
data
);

setPoses(
data.poses || []
);

}catch(err){

console.error(err);

}

setLoading(false);

}

load();

},[id]);


const heroImages=
useMemo(
()=>
poses.filter(
(p)=>
p.poseId==="hero"||
p.poseId==="back"
),
[poses]
);


const lookbookImages=
useMemo(
()=>
poses.filter(
(p)=>
p.poseId!=="hero"&&
p.poseId!=="back"
),
[poses]
);


if(loading){

return(

<div className="ecom-loading">

Loading Lookbook...

</div>

);

}


return(

<div className="ecom-page">

<div className="ecom-container">

<div className="ecom-header">

<div className="ecom-badge">

MAGICREEL AI STUDIO

</div>

<h1>

PURE STUDIO PACK

</h1>

<p>

{lookbookImages.length}
Images Generated

</p>


<div className="ecom-actions">

<button>

Export ZIP

</button>

<button>

Share Link

</button>


{heroImages.length===2&&(

<button
className="primary"
>

Generate 360° Reel

</button>

)}

</div>

</div>



<section>

<h2>

Generated Looks

</h2>


<div className="look-grid">

{lookbookImages.map((p)=>(

<div
key={p.poseId}
className="look-card"
>

<img
src={p.imageUrl}
/>

<div className="overlay">

<button>

Download

</button>

</div>

</div>

))}

</div>

</section>



{heroImages.length>0&&(

<section>

<h2>

Hero Assets

</h2>


<div
className={

heroImages.length===1

?

"hero-grid single"

:

"hero-grid"

}

>

{heroImages.map((hero)=>(

<div
key={hero.poseId}
className="hero-card"
>

<img
src={hero.imageUrl}
/>

<div className="hero-footer">

<button>

Download

</button>

</div>

</div>

))}

</div>

</section>

)}


</div>

</div>

);

}