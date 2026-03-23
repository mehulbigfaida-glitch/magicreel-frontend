import React from "react";

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const TwoPaneStudioLayout: React.FC<Props> = ({
  left,
  right,
  title,
  subtitle,
}) => {
  return (
    <div className="studio-wrap">
      <div className="studio-header">
        {title && <h2>{title}</h2>}
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="studio-grid">
        <section className="studio-left">{left}</section>
        <section className="studio-right">{right}</section>
      </div>
    </div>
  );
};

export default TwoPaneStudioLayout;
