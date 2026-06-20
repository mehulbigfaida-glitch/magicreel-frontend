import "./PublishPage.css";

interface Props {
  onReplaceMedia: () => void;
}

export default function PublishToolbar({
  onReplaceMedia
}: Props) {

  return (

    <div className="publish-toolbar">

      <button
        className="replace-media-btn"
        onClick={onReplaceMedia}
      >
        🔄 Replace Media
      </button>

    </div>

  );

}