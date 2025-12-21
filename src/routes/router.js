import { createBrowserRouter, Navigate } from "react-router-dom";
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
import Navigation from "../pages/navigation/Navigation";
import FindPassword from "../pages/auth/FindPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ChangePassword from "../pages/mypage/ChangePassword";
import MyPageLayOut from "../pages/mypage/MyPageLayOut";

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
    path: "/auth/findPassword",
    element: <FindPassword />
  },
  {
    path: "/auth/reset-password",
    element: <ResetPassword />
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
    path: "/main/navigation/:id",
    element: <Navigation />
  },
  {
    path: "/main/help",
    element: <HelpPage />
  },
  {
    path: "/main/mypage",
    element: <Navigate to="/mypage" replace />,
  },
  {
    path: "/main/profile",
    element: <Navigate to="/mypage/profile" replace />,
  },
  {
    path: "/mypage",
    element: <MyPageLayOut />,
    children: [
      {
        index: true,
        element: <MyPage />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "change-password",
        element: <ChangePassword />,
      },
      {
        path: "health",
        element: <HealthInfo />,
      },
      {
        path: "visit-history",
        element: <VisitHistory />,
      },
    ],
  },
]);

export default router;