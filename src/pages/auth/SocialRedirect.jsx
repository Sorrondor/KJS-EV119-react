import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SocialRedirect = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const param = new URLSearchParams(search);
    const accessToken = param.get("accessToken"); 

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      navigate("/main/mypage", { replace: true }); 
    } else {
      navigate("/auth/login", { replace: true }); 
    }
  }, [search, navigate]);

  return <div>소셜 로그인 처리중입니다..</div>;
};

export default SocialRedirect;
