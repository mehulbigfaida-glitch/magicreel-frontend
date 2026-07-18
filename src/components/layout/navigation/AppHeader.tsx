import { Link } from "react-router-dom";

import "./AppHeader.css";

import DesktopNav from "./DesktopNav";
import HeaderAccount from "./HeaderAccount";

export default function AppHeader() {
  return (
    <header className="mr-header">
      {/* Logo */}

      <Link
        to="/"
        className="mr-logo"
      >
        MagicReel
      </Link>

      {/* Desktop Navigation */}

      <DesktopNav />

      {/* Right Side */}

      <div className="mr-header-right">
        <HeaderAccount />

        <button
          className="mr-mobile-menu-button"
          aria-label="Open navigation"
        >
          ☰
        </button>
      </div>
    </header>
  );
}