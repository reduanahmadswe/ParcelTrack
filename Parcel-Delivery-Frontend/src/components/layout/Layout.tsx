import ConditionalNavigation from "./Navigation/ConditionalNavigation";
import ConditionalFooter from "./Footer/ConditionalFooter";
import React from "react";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <ConditionalNavigation />
      <main className="flex-grow">{children}</main>
      <ConditionalFooter />
    </div>
  );
}

