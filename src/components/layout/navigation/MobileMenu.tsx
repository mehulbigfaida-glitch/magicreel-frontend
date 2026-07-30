import { useState } from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  Sparkles,
  Images,
  Rocket,
  Share2,
  BookOpen,
  ShieldCheck,
  LifeBuoy,
  CreditCard,
  X,
  ChevronDown,
  ChevronRight,
  Package,
  Megaphone,
  Newspaper,
} from "lucide-react";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({
  open,
  onClose,
}: MobileMenuProps) {

  const location = useLocation();

  const [creativeOpen, setCreativeOpen] = useState(false);

  if (!open) return null;

  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  return (
    <>
      <div
        className="mr-mobile-overlay"
        onClick={onClose}
      />

      <nav className="mr-mobile-menu">

        <div className="mr-mobile-header">

          <div>
            <div className="mr-mobile-brand">
              MagicReel
            </div>

            <div className="mr-mobile-subtitle">
              Fashion Intelligence Engine
            </div>
          </div>

          <button
            className="mr-mobile-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={28} />
          </button>

        </div>

        <div className="mr-mobile-section-title">
          CREATE
        </div>

        <div className="mr-mobile-expandable">

          <button
            type="button"
            className="mr-mobile-expand-btn"
            onClick={() => setCreativeOpen(!creativeOpen)}
          >
            <div className="mr-mobile-expand-left">
              <Sparkles size={18} />
              <span>Creative Studio</span>
            </div>

            {creativeOpen ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}

          </button>

          {creativeOpen && (

            <div className="mr-mobile-submenu">

              <Link
                to="/pack/ecom"
                onClick={onClose}
                className={isActive("/pack/ecom") ? "active" : ""}
              >
                <Package size={17} />
                <span>Lookbook Studio</span>
              </Link>

              <Link
                to="/campaign-engine"
                onClick={onClose}
                className={isActive("/campaign-engine") ? "active" : ""}
              >
                <Megaphone size={17} />
                <span>Campaign Studio</span>
              </Link>

              <Link
                to="/create/social-campaign"
                onClick={onClose}
                className={isActive("/create/social-campaign") ? "active" : ""}
              >
                <Newspaper size={17} />
                <span>Editorial Campaign Studio</span>
              </Link>

            </div>

          )}

        </div>

        <Link
          to="/predictions"
          onClick={onClose}
          className={isActive("/predictions") ? "active" : ""}
        >
          <Images size={18} />
          <span>Portfolio</span>
        </Link>

        <Link
          to="/publish"
          onClick={onClose}
          className={isActive("/publish") ? "active" : ""}
        >
          <Rocket size={18} />
          <span>Publish</span>
        </Link>

        <div className="mr-mobile-divider" />

        <div className="mr-mobile-section-title">
          BUSINESS
        </div>

        <Link
          to="/social-media"
          onClick={onClose}
          className={isActive("/social-media") ? "active" : ""}
        >
          <Share2 size={18} />
          <span>Social Accounts</span>
        </Link>

        <Link
          to="/plans"
          onClick={onClose}
          className={isActive("/plans") ? "active" : ""}
        >
          <CreditCard size={18} />
          <span>Pricing</span>
        </Link>

        <div className="mr-mobile-divider" />

        <div className="mr-mobile-section-title">
          HELP
        </div>

        <Link
          to="/docs"
          onClick={onClose}
          className={isActive("/docs") ? "active" : ""}
        >
          <BookOpen size={18} />
          <span>Documentation</span>
        </Link>

        <Link
          to="/policies"
          onClick={onClose}
          className={isActive("/policies") ? "active" : ""}
        >
          <ShieldCheck size={18} />
          <span>Policies</span>
        </Link>

        <Link
          to="/support/contact"
          onClick={onClose}
          className={isActive("/support") ? "active" : ""}
        >
          <LifeBuoy size={18} />
          <span>Contact Support</span>
        </Link>

        <div className="mr-mobile-footer">
          <div className="mr-mobile-footer-line" />
          <div className="mr-mobile-version">
            MagicReel Beta v1.0
          </div>
        </div>

      </nav>
    </>
  );
}