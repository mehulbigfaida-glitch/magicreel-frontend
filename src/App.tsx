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
import SocialPackPage from "./pages/create-v2/SocialPackPage";
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
import SocialCampaignPage from "./pages/create-v3/SocialCampaignPage";
import CreateAIPage from "./pages/create-ai/CreateAIPage.tsx";

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

  const user = isSharePage
  ? null
  : useAuthStore((state) => state.user);

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
              </a>

              {lockAdvancedPacks ? (
                <div
                  className="mr-create-item locked"
                  onClick={() => navigate("/plans")}
                >
                  🔒 Social Pack
                </div>
              ) : (
                <a href="/social-pack" className="mr-create-item">
                  Social Pack
                </a>
              )}

              {lockAdvancedPacks ? (
                <div
                  className="mr-create-item locked"
                  onClick={() => navigate("/plans")}
                >
                  🔒 Cinematic Pack
                </div>
              ) : (
                <a href="/cinematic" className="mr-create-item">
                  Cinematic Pack
                </a>
              )}
            </div>
          </div>

          <a href="/predictions">Creations</a>
          <a href="/plans">Plans</a>
        </nav>
      </div>

      {/* ✅ SAFE HEADER RENDER */}
      {user && user.email ? (
        <div className="mr-header-right">
          <span className="mr-credits">
            {user.creditsAvailable ?? 0} Credits
          </span>

          <div className="mr-profile-menu">
            <div className="mr-user-circle">
              {user.email?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="mr-profile-dropdown">
              <a href="/dashboard">Dashboard</a>
              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mr-header-right">
          <span className="mr-credits">...</span>
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

      <Route
        path="/create-v2"
        element={
          <ProtectedRoute>
            <CreateV2Page />
          </ProtectedRoute>
        }
      />

    <Route
  path="/create/social-pack"
  element={
    <ProtectedRoute>
      <SocialPackPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/create/social-campaign"
  element={<SocialCampaignPage />}
/>

<Route
  path="/create/ai"
  element={<CreateAIPage />}
/>

      <Route path="/lookbook" element={<LookbookPage />} />
      <Route path="/cinematic" element={<CinematicPage />} />
      <Route path="/plans" element={<PlansPage />} />
      <Route path="/tryon-demo" element={<TryOnDemo />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/view" element={<ViewPage />} />

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

  const location = useLocation(); // 🔥 ADD THIS

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    // 🔥 RUN ON EVERY ROUTE CHANGE
    fetchMe();

  }, [location.pathname]); // 🔥 KEY FIX

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