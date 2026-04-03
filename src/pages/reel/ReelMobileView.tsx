import { useSearchParams } from "react-router-dom";

export default function ReelMobileView() {
  const [params] = useSearchParams();

  const video = params.get("video") || "";
  const caption = params.get("caption") || "";

  if (!video) {
    return <div className="p-4">Invalid video</div>;
  }

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col">
      <video src={video} controls className="w-full" />
      <div className="p-4">{caption}</div>
    </div>
  );
}