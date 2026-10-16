import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div data-panel="admin" className="flex min-h-screen bg-transparent font-[Inter] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-transparent">
        {children || <Outlet />}
      </main>
    </div>
  );
}