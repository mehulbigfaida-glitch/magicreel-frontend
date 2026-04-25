import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuthStore } from "./store/authStore";

/* =========================
   PAGES
========================= */

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import ViewPage from "./pages/ViewPage";
import TryOnDemo from "./pages/TryOnDemo";
import PlansPage from "./pages/PlansPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import CreateV2Page from "./pages/create-v2/CreateV2Page";
import LookbookPage from "./pages/create-v2/lookbook/LookbookPage";
import CinematicPage from "./pages/create-v2/cinematic/CinematicPage";

import ReelViewerPage from "./pages/reel/ReelViewerPage";
import ReelMobileView from "./pages/reel/ReelMobileView";


import PredictionsPage from "./pages/PredictionsPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SharePage from "./pages/SharePage";
import ImageQualityPage from "./pages/docs/ImageQualityPage";
import CreatePageV3 from "./v3/pages/CreatePageV3";

/* =========================
   CONTEXT
========================= */

import { GenerateProvider } from "./context/GenerateContext";


import "./App.css";

/* =========================
   GLOBAL HEADER
========================= */

function GlobalHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const isSharePage = location.pathname.startsWith("/s/");

  const { user } = isSharePage
    ? { user: null }
    : useAuthStore();

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
    navigate("/login");
    window.location.reload();
  };

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

          <div className="mr-help-menu">
            Help ▾
            <div className="mr-help-dropdown">
              <a href="/docs">Documentation</a>
              <a href="/docs/image-quality">
                Image Guidelines
              </a>
              <a href="/faq">FAQ</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
        </nav>
      </div>

      {user && (
        <div className="mr-header-right">
          <span className="mr-credits">
            {user.creditsAvailable} Credits
          </span>

          <div className="mr-profile-menu">
            <div className="mr-user-circle">
              {user.email.charAt(0).toUpperCase()}
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

  {/* 🔐 PROTECTED */}
  <Route
    path="/create-v2"
    element={
      <ProtectedRoute>
        <CreateV2Page />
      </ProtectedRoute>
    }
  />

  <Route path="/lookbook" element={<LookbookPage />} />
  <Route path="/cinematic" element={<CinematicPage />} />
  <Route path="/plans" element={<PlansPage />} />
  <Route path="/tryon-demo" element={<TryOnDemo />} />

  {/* 🔐 AUTH */}
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />

  <Route path="/view" element={<ViewPage />} />

  {/* 🔐 PROTECTED */}
  <Route
    path="/predictions"
    element={
      <ProtectedRoute>
        <PredictionsPage />
      </ProtectedRoute>
    }
  />

  <Route path="/reel/view" element={<ReelMobileView />} />
  <Route path="/share/:id" element={<SharePage />} />
  <Route path="/reel" element={<ReelViewerPage />} />
  <Route path="/reel-viewer" element={<ReelViewerPage />} />

  {/* 🔐 PROTECTED */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    }
  />

  <Route path="/v3" element={<CreatePageV3 />} />

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
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const setUser = useAuthStore((state) => state.setUser);

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔥 FORCE RESET IF NO TOKEN
    if (!token) {
      setUser(null);
      return;
    }

    fetchMe();
  }, [fetchMe, setUser]);

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
      <GenerateProvider>
        <AppLayout />
      </GenerateProvider>
    </BrowserRouter>
  );
}