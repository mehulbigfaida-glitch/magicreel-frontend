import "./SiteFooter.css";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-copy">
          © {new Date().getFullYear()} MagicReel. All rights reserved.
        </div>
        <div className="site-footer-entity">
          MagicReel is a product of MEHUL HARSHAD GANDHI HUF, operating under the trade name AMJIS. GSTIN: 27AASHM8403M1ZI.
        </div>
      </div>
    </footer>
  );
}
