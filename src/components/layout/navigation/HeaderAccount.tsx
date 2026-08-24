import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, Zap } from "lucide-react";

import { useAuthStore } from "../../../store/authStore";
import useClickOutside from "../../../hooks/useClickOutside";

import ProfileMenu from "./ProfileMenu";

import "./HeaderAccount.css";

export default function HeaderAccount() {
  const user = useAuthStore((state) => state.user);
  const refreshCredits = useAuthStore(
    (state) => state.refreshCredits
  );

  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, () => {
    setProfileOpen(false);
  });

  // Close on route change
  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  // Close on Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Refresh global account credits after purchases/generation
  useEffect(() => {
    const handleCreditsUpdated = () => {
      void refreshCredits();
    };

    window.addEventListener(
      "creditsUpdated",
      handleCreditsUpdated
    );

    return () => {
      window.removeEventListener(
        "creditsUpdated",
        handleCreditsUpdated
      );
    };
  }, [refreshCredits]);

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "My Account";

  const initials = displayName
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const credits = user?.creditsAvailable ?? 0;

  const plan =
    user?.plan ||
    user?.subscription?.plan ||
    "FREE";

  return (
    <div className="mr-header-account">

      {/* Credits */}

      <div
        className="mr-credits-pill"
        title={`${credits} Credits Available`}
      >
        <Zap size={16} />
        <span>{credits}</span>
      </div>

      {/* Plan */}

      <div className="mr-plan-pill">
        {plan}
      </div>

      {/* Profile */}

      <div
        className="mr-profile-wrapper"
        ref={wrapperRef}
      >
        <button
          className="mr-profile-button"
          onClick={() =>
            setProfileOpen((open) => !open)
          }
        >
          <div className="mr-avatar">
            {initials}
          </div>

          <span className="mr-profile-name">
            {displayName}
          </span>

          <ChevronDown
            size={16}
            className={`mr-profile-chevron ${
              profileOpen ? "open" : ""
            }`}
          />
        </button>

        {profileOpen && (
          <ProfileMenu
            onClose={() => setProfileOpen(false)}
          />
        )}
      </div>
    </div>
  );
}