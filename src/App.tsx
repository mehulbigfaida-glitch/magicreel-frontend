import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import AppHeader from "./components/layout/navigation/AppHeader";
import { useAuthStore } from "./store/authStore";

/* =========================
   PAGES
========================= */
import CampaignOutputPage from "./pages/campaign/CampaignOutputPage";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import ViewPage from "./pages/ViewPage";
import TryOnDemo from "./pages/TryOnDemo";
import PlansPage from "./pages/PlansPage";
import Login from "./pages/Login";
import SignupV2Page from "./pages/SignupV2Page";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import OnboardingWizard from "./pages/onboarding/OnboardingWizard";
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
import CreateAIHero from "./pages/create-ai-hero/CreateAIHero";
import EcomStudioPage from "./pages/create-ai-hero/EcomStudioPage";
import EcomOutputPage from "./pages/create-ai-hero/lookbook/EcomOutputPage";
import ReelOutputPage from "./pages/reel/ReelOutputPage";
import Reels360OutputPage from "./pages/reels360/Reels360OutputPage";
import PublishPage from "./pages/publish/PublishPage";
import CampaignV2Page
from "./pages/CampaignV2Page";
import CampaignGeneratingPage from "./pages/campaign/CampaignGeneratingPage";
import SocialMediaPage from "./pages/social-media/SocialMediaPage";

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

  const hideHeaderRoutes = [
    "/create-v2",
    "/cinematic",
    "/view",
    "/reel-viewer",
  ];

  if (hideHeaderRoutes.includes(location.pathname)) {
    return null;
  }

  return <AppHeader />;
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

<Route
   path="/create-ai-hero"
   element={<CreateAIHero />}
/>

<Route
  path="/pack/ecom"
  element={<EcomStudioPage />}
/>

<Route
  path="/pack/ecom/output/:id"
  element={<EcomOutputPage />}
/>

<Route
  path="/publish"
  element={
    <ProtectedRoute>
      <PublishPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/campaign-engine"
  element={<CampaignV2Page />}
/>

<Route
  path="/campaign/generating"
  element={
    <ProtectedRoute>
      <CampaignGeneratingPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/campaign/:id"
  element={
    <ProtectedRoute>
      <CampaignOutputPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/social-media"
  element={<SocialMediaPage />}
/>

      <Route path="/lookbook" element={<LookbookPage />} />
      <Route path="/cinematic" element={<CinematicPage />} />
      <Route path="/plans" element={<PlansPage />} />
      <Route path="/tryon-demo" element={<TryOnDemo />} />

      <Route path="/login" element={<Login />} />
<Route path="/signup" element={<SignupV2Page />} />
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
<Route
  path="/onboarding"
  element={
    <ProtectedRoute>
      <OnboardingWizard />
    </ProtectedRoute>
  }
/>
      <Route path="/view" element={<ViewPage />} />

      <Route
        path="/predictions"
        element={
          <ProtectedRoute>
            <PredictionsPage />
          </ProtectedRoute>
        }
      />
<Route
  path="/reel/:renderId"
  element={<ReelOutputPage />}
/>

<Route
  path="/reels360/:runId"
  element={<Reels360OutputPage />}
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