import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({
  open,
  onClose,
}: MobileMenuProps) {
  const location = useLocation();

  if (!open) return null;

  return (
    <>
      <div
        className="mr-mobile-overlay"
        onClick={onClose}
      />

      <nav className="mr-mobile-menu">
        <button
          className="mr-mobile-close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          ✕
        </button>

        <Link to="/create-ai-hero" onClick={onClose}>
  Creative Studio
</Link>

        <Link to="/predictions" onClick={onClose}>
          Portfolio
        </Link>

        <Link to="/publish" onClick={onClose}>
          Publish
        </Link>

        <Link to="/social-media" onClick={onClose}>
          Social Accounts
        </Link>

        <Link to="/docs" onClick={onClose}>
  Documentation
</Link>

<Link to="/policies" onClick={onClose}>
  Policies
</Link>

<Link to="/support/contact" onClick={onClose}>
  Contact Support
</Link>

        <Link to="/plans" onClick={onClose}>
          Pricing
        </Link>
      </nav>
    </>
  );
}