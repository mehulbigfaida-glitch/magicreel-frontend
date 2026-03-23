import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Verify: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, redirectTo } = (location.state || {}) as {
    email?: string;
    redirectTo?: string;
  };

  const handleEnter = () => {
    navigate(redirectTo || "/create/garment");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0B0F14",
        color: "#FFFFFF",
      }}
    >
      <div
        style={{
          width: 380,
          padding: "32px 28px",
          borderRadius: 16,
          background: "#111827",
          boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
        }}
      >
        {/* Header */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            marginBottom: 6,
            letterSpacing: "-0.3px",
          }}
        >
          Access Verified
        </div>

        {/* Context */}
        <div
          style={{
            fontSize: 14,
            color: "#9CA3AF",
            marginBottom: 22,
            lineHeight: 1.5,
          }}
        >
          {email ? (
            <>
              Logged in as <strong>{email}</strong>
              <br />
              You have access to the MagicReel studio.
            </>
          ) : (
            <>
              Your access has been verified.
              <br />
              You may now enter the MagicReel studio.
            </>
          )}
        </div>

        {/* Action */}
        <button
          onClick={handleEnter}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "none",
            background: "#FFFFFF",
            color: "#0B0F14",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Enter Studio
        </button>

        {/* Footer */}
        <div
          style={{
            marginTop: 18,
            fontSize: 12,
            color: "#6B7280",
            textAlign: "center",
          }}
        >
          MagicReel is a private beta platform.
        </div>
      </div>
    </div>
  );
};

export default Verify;
