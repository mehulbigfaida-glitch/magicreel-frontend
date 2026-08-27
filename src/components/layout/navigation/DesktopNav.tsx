import "./DesktopNav.css";

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import CreativeStudioMenu from "./CreativeStudioMenu";
import ResourcesMenu from "./ResourcesMenu";
import useClickOutside from "../../../hooks/useClickOutside";
import FeatureLockedModal from "../../FeatureLockedModal";
import { useAuthStore } from "../../../store/authStore";

type OpenMenu = "creative" | "resources" | null;

export default function DesktopNav() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const [showPublishLock, setShowPublishLock] = useState(false);

  const publishingActive =
    !!user?.publishingSubscriptionEnd &&
    new Date(user.publishingSubscriptionEnd) > new Date();

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  const navRef = useRef<HTMLDivElement>(null);

  useClickOutside(navRef, () => {
    setOpenMenu(null);
  });

  // Close menus on navigation
  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname]);

  // Close on Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isActive = (path: string) =>
    location.pathname.startsWith(path);

  return (
    <nav
      className="mr-desktop-nav"
      ref={navRef}
    >
      {/* Creative Studio */}

      <div className="mr-nav-dropdown">
        <button
          className={`mr-nav-button ${
            isActive("/create") ||
            isActive("/create-ai-hero") ||
            isActive("/campaign-engine") ||
            isActive("/pack") ||
            isActive("/create/social")
              ? "active"
              : ""
          }`}
          onClick={() =>
            setOpenMenu((current) =>
              current === "creative" ? null : "creative"
            )
          }
        >
          Creative Studio

          <span className="mr-nav-chevron">
            ▾
          </span>
        </button>

        {openMenu === "creative" && (
          <CreativeStudioMenu />
        )}
      </div>

      {/* Portfolio */}

      <Link
        to="/predictions"
        className={`mr-nav-link ${
          isActive("/predictions") ? "active" : ""
        }`}
      >
        Portfolio
      </Link>


      {/* Social Accounts */}

      {publishingActive ? (
        <Link
          to="/social-media"
          className={`mr-nav-link ${
            isActive("/social-media") ? "active" : ""
          }`}
        >
          Social Accounts
        </Link>
      ) : (
        <button
          type="button"
          className="mr-nav-link"
          onClick={() => setShowPublishLock(true)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            font: "inherit",
          }}
        >
          Social Accounts
        </button>
      )}

      <FeatureLockedModal
        open={showPublishLock}
        title="Publishing is not activated"
        description="Connect your social accounts and publish your MagicReel content by activating the Publishing plan."
        featureName="Social Accounts"
        primaryLabel="Activate Publishing"
        onClose={() => setShowPublishLock(false)}
      />

      {/* Resources */}

      <div className="mr-nav-dropdown">
        <button
          className="mr-nav-button"
          onClick={() =>
            setOpenMenu((current) =>
              current === "resources"
                ? null
                : "resources"
            )
          }
        >
          Resources

          <span className="mr-nav-chevron">
            ▾
          </span>
        </button>

        {openMenu === "resources" && (
          <ResourcesMenu />
        )}
      </div>

      {/* Pricing */}

      <Link
        to="/plans"
        className={`mr-nav-link ${
          isActive("/plans") ? "active" : ""
        }`}
      >
        Pricing
      </Link>
    </nav>
  );
}
