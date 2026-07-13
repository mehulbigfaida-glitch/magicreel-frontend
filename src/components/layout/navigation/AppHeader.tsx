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

      <HeaderAccount />

    </header>
  );
}