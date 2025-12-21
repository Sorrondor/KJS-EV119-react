import React, { createContext, useContext, useState } from "react";

const MyPageLayoutContext = createContext();

export const useMyPageLayout = () => {
  const context = useContext(MyPageLayoutContext);
  if (!context) {
    throw new Error("useMyPageLayout must be used within MyPageLayoutProvider");
  }
  return context;
};

export const MyPageLayoutProvider = ({ children }) => {
  const [title, setTitle] = useState("마이페이지");
  const [topContent, setTopContent] = useState(null);

  return (
    <MyPageLayoutContext.Provider
      value={{ title, setTitle, topContent, setTopContent }}>
      {children}
    </MyPageLayoutContext.Provider>
  );
};
