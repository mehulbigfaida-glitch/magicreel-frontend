import Login from "./pages/Login";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import ViewPage from "./pages/ViewPage";
import TryOnDemo from "./pages/TryOnDemo";
import PlansPage from "./pages/PlansPage";
import CreateV2Page from "./pages/create-v2/CreateV2Page";
import LookbookPage from "./pages/create-v2/lookbook/LookbookPage";
import CinematicPage from "./pages/create-v2/cinematic/CinematicPage";

import ReelViewerPage from "./pages/reel/ReelViewerPage";
import PredictionsPage from "./pages/PredictionsPage";
import DashboardPage from "./pages/dashboard/DashboardPage";

import { GenerateProvider } from "./context/GenerateContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import CreatePageV3 from "./v3/pages/CreatePageV3";

/* 🔥 NEW IMPORT */
import ImageQualityPage from "./pages/docs/ImageQualityPage";

import "./App.css";

/* =========================
   GLOBAL HEADER
========================= */

function GlobalHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const hideHeaderRoutes = [
    "/create-v2",
    "/cinematic",
    "/view",
    "/reel-viewer",
  ];

  if (hideHeaderRoutes.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const initial = user?.email
    ? user.email.charAt(0).toUpperCase()
    : "";

  const lockAdvancedPacks =
    user?.plan === "FREE" ||
    user?.plan === "BASIC";

  return (
    <header className="mr-global-header">

      <div className="mr-header-left">

        <a href="/" className="mr-logo-link">
          MagicReel
        </a>

        <nav className="mr-main-nav">

          {/* CREATE MENU */}

          <div className="mr-create-menu">
            <span className="mr-create-trigger">
              Create ▾
            </span>

            <div className="mr-create-dropdown">

              <a href="/create-v2" className="mr-create-item">
                <div className="mr-create-item-title">
                  E-Commerce Pack
                </div>
                <div className="mr-create-item-desc">
                  Studio product photos for marketplaces
                </div>
              </a>

              {lockAdvancedPacks ? (
                <div
                  className="mr-create-item locked"
                  onClick={() => navigate("/plans")}
                >
                  <div className="mr-create-item-title">
                    🔒 Social Pack
                  </div>
                  <div className="mr-create-item-desc">
                    Instagram ready visuals and reels
                  </div>
                </div>
              ) : (
                <a href="/social-pack" className="mr-create-item">
                  <div className="mr-create-item-title">
                    Social Pack
                  </div>
                  <div className="mr-create-item-desc">
                    Instagram ready visuals and reels
                  </div>
                </a>
              )}

              {lockAdvancedPacks ? (
                <div
                  className="mr-create-item locked"
                  onClick={() => navigate("/plans")}
                >
                  <div className="mr-create-item-title">
                    🔒 Cinematic Pack
                  </div>
                  <div className="mr-create-item-desc">
                    High-end fashion campaign visuals
                  </div>
                </div>
              ) : (
                <a href="/cinematic" className="mr-create-item">
                  <div className="mr-create-item-title">
                    Cinematic Pack
                  </div>
                  <div className="mr-create-item-desc">
                    High-end fashion campaign visuals
                  </div>
                </a>
              )}

            </div>
          </div>

          <a
            href="/predictions"
            className={
              location.pathname === "/predictions"
                ? "active"
                : ""
            }
          >
            Creations
          </a>

          <a href="/plans">Plans</a>

          {/* HELP MENU */}
          <div className="mr-help-menu">
            Help ▾

            <div className="mr-help-dropdown">
              <a href="/docs">Documentation</a>
              <a href="/docs/image-quality">Image Guidelines</a> {/* 🔥 NEW */}
              <a href="/faq">FAQ</a>
              <a href="/contact">Contact</a>
            </div>
          </div>

        </nav>

      </div>

      {!loading && user && (
        <div className="mr-header-right">

          <span className="mr-credits">
            {user?.creditsAvailable} Credits
          </span>

          <div className="mr-profile-menu">

            <div className="mr-user-circle">
              {initial}
            </div>

            <div className="mr-profile-dropdown">
              <a href="/dashboard">Dashboard</a>
              <a href="/settings">Settings</a>
              <button onClick={handleLogout}>
                Logout
              </button>
            </div>

          </div>

        </div>
      )}

    </header>
  );
}

/* =========================
   ROUTES
========================= */

function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/create-v2" element={<CreateV2Page />} />
      <Route path="/lookbook" element={<LookbookPage />} />
      <Route path="/cinematic" element={<CinematicPage />} />
      <Route path="/plans" element={<PlansPage />} />
      <Route path="/tryon-demo" element={<TryOnDemo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/view" element={<ViewPage />} />
      <Route path="/predictions" element={<PredictionsPage />} />
      <Route path="/reel-viewer" element={<ReelViewerPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/v3" element={<CreatePageV3 />} />

      {/* 🔥 NEW ROUTE */}
      <Route
        path="/docs/image-quality"
        element={<ImageQualityPage />}
      />

    </Routes>
  );
}

/* =========================
   APP LAYOUT
========================= */

function AppLayout() {
  return (
    <div className="mr-app-wrapper">

      <GlobalHeader />

      <div className="mr-app-content">
        <AppRoutes />
      </div>

    </div>
  );
}

/* =========================
   ROOT APP
========================= */

export default function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <GenerateProvider>

          <AppLayout />

        </GenerateProvider>

      </AuthProvider>

    </BrowserRouter>
  );
}