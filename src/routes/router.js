import { createBrowserRouter } from "react-router-dom";
import Intro from "../pages/intro/Intro";
import MapContainer from "../pages/map/MapContainer";
import EmergencyRoomDetail from "../pages/emergencyRoom/EmergencyRoomDetail";
import RouteGuidance from "../pages/route/RouteGuidance";
import HelpPage from "../pages/help/HelpPage";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import MyPage from "../pages/mypage/MyPage";
import Profile from "../pages/mypage/Profile";
import HealthInfo from "../pages/mypage/HealthInfo";
import VisitHistory from "../pages/mypage/VisitHistory";
import SocialRedirect from "../pages/auth/SocialRedirect";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Intro />
  },
  {
    path: "/intro",
    element: <Intro />
  },
  {
    path: "/auth/login",
    element: <Login />
  },
  {
    path: "/auth/signup",
    element: <SignUp />
  },
  {
    path: "/auth/oauth2/redirect",
    element: <SocialRedirect />
  },
  {
    path: "/main/map",
    element: <MapContainer />
  },
  {
    path: "/main/emergency-room/:id",
    element: <EmergencyRoomDetail />
  },
  {
    path: "/main/route/:id",
    element: <RouteGuidance />
  },
  {
    path: "/main/help",
    element: <HelpPage />
  },
  {
    path: "/main/mypage",
    element: <MyPage />
  },
  {
    path: "/main/profile",
    element: <Profile />
  },
  {
    path: "/main/health",
    element: <HealthInfo />
  },
  {
    path: "/main/visit-history",
    element: <VisitHistory />
  },
])

export default router;