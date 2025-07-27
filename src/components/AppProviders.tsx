// src/providers/AppProviders.tsx

"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

const AppProviders = ({ children }: Props) => {
  // You can wrap AuthProvider, ThemeProvider, etc. here
  return (
    <>
      {/* Example: <AuthProvider> */}
      {children}
      {/* </AuthProvider> */}
    </>
  );
};

export default AppProviders;
