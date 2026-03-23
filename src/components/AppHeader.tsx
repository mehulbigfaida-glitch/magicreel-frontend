import "./AppHeader.css";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function AppHeader() {
  const location = useLocation();

  const [helpOpen, setHelpOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="mr-header">

      <Link to="/" className="mr-logo">
        MagicReel
      </Link>

      <nav className="mr-nav">

        <Link
          to="/create"
          className={isActive("/create") ? "active" : ""}
        >
          Create
        </Link>

        <Link
          to="/dashboard"
          className={isActive("/dashboard") ? "active" : ""}
        >
          Dashboard
        </Link>

        <Link
          to="/plans"
          className={isActive("/plans") ? "active" : ""}
        >
          Plans
        </Link>

        {/* HELP MENU */}

        <div
          className="mr-dropdown"
          onMouseEnter={() => setHelpOpen(true)}
          onMouseLeave={() => setHelpOpen(false)}
        >
          <span className="mr-nav-item">
            Help
          </span>

          {helpOpen && (
            <div className="mr-dropdown-menu">

              <Link to="/docs">
                Documentation
              </Link>

              <Link to="/faq">
                FAQ
              </Link>

              <Link to="/contact">
                Contact Support
              </Link>

            </div>
          )}
        </div>

      </nav>

      <div className="mr-header-right">

        <div className="mr-credits">
          Credits: 48
        </div>

        {/* PROFILE MENU */}

        <div
          className="mr-dropdown"
          onMouseEnter={() => setProfileOpen(true)}
          onMouseLeave={() => setProfileOpen(false)}
        >
          <div className="mr-profile">
            Profile
          </div>

          {profileOpen && (
            <div className="mr-dropdown-menu">

              <Link to="/dashboard">
                Dashboard
              </Link>

              <Link to="/settings">
                Settings
              </Link>

              <Link to="/logout">
                Logout
              </Link>

            </div>
          )}
        </div>

      </div>

    </header>
  );
}