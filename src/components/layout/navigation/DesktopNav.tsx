import "./DesktopNav.css";

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import CreativeStudioMenu from "./CreativeStudioMenu";
import ResourcesMenu from "./ResourcesMenu";
import useClickOutside from "../../../hooks/useClickOutside";

type OpenMenu = "creative" | "resources" | null;

export default function DesktopNav() {
  const location = useLocation();

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

      {/* Publish */}

      <Link
        to="/publish"
        className={`mr-nav-link ${
          isActive("/publish") ? "active" : ""
        }`}
      >
        Publish
      </Link>

      {/* Social Accounts */}

      <Link
        to="/social-media"
        className={`mr-nav-link ${
          isActive("/social-media") ? "active" : ""
        }`}
      >
        Social Accounts
      </Link>

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