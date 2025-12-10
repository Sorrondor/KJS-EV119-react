import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SocialRedirect = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const param = new URLSearchParams(search);
    const accessToken = param.get("accessToken"); 
    const memberId = param.get("memberId");
    const memberName = param.get("memberName");
    const memberEmail = param.get("memberEmail");

    console.log(memberId, memberName, memberEmail);

    const member ={
      memberId: memberId ? Number(memberId) : null,
      memberName: memberName||'',
      memberEmail: memberEmail || ''
    }; 

    console.log(member);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('member', JSON.stringify(member));
    localStorage.setItem('isLoggedIn', 'true');

    navigate('/' , {replace:true});
  }, [search, navigate]);

  return <div>소셜 로그인 처리중입니다..</div>;
};

export default SocialRedirect;
