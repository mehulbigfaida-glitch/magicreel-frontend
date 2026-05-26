import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";

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

console.log(data);

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


if(loading){

return(

<div
style={{

padding:"80px",
color:"white"

}}
>

Loading Lookbook...

</div>

);

}


return(

<div
style={{

background:"#000",
minHeight:"100vh",
padding:"40px"

}}
>

<h1
style={{

color:"white",
marginBottom:"30px"

}}
>

Lookbook Output

</h1>

<div
style={{

display:"grid",

gridTemplateColumns:
"repeat(3,1fr)",

gap:"20px"

}}
>

{poses.map((p)=>(

<div
key={p.poseId}

style={{

background:"#111",

borderRadius:"18px",

overflow:"hidden"

}}
>

<img

src={p.imageUrl}

style={{

width:"100%",

display:"block"

}}

/>

<div
style={{

padding:"12px",

color:"white"

}}
>

{p.poseId}

</div>

</div>

))}

</div>

</div>

);

}