import React from "react";

export type UserRole = "admin" | "sender" | "receiver";

export interface RouteConfig {
  path: string;
  element: React.ReactElement;
  protected?: boolean;
  allowedRoles?: UserRole[];
  layout?: boolean;
}

import ContactPage from "./pages/public/ContactPage";
import HomePage from "./pages/public/HomePage";
import TrackPage from "./pages/public/TrackPage";
import StatusHistoryPage from "./features/tracking/StatusHistoryPage";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/public/TermsOfServicePage";
import CookiePolicyPage from "./pages/public/CookiePolicyPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DebugAuthPage from "./pages/auth/DebugAuthPage";
import GoogleAuthCallback from "./pages/auth/GoogleAuthCallback";

import AdminDashboard from "./features/dashboard/AdminDashboard";
import SenderDashboard from "./features/dashboard/SenderDashboard";
import ReceiverDashboard from "./features/dashboard/ReceiverDashboard";
import ProfilePage from "./features/dashboard/ProfilePage";

import ParcelManagementPage from "./pages/admin/ParcelManagement";
import SystemSettingsPage from "./pages/admin/SystemSettings";
import UserManagementPage from "./pages/admin/UserManagement";

import CreateParcelPage from "./pages/sender/CreateParcelPage";
import SenderParcelsPage from "./pages/sender/SenderParcelsPage";
import SenderStatisticsPage from "./pages/sender/SenderStatisticsPage";

import NotFoundPage from "./pages/error/NotFoundPage";
import UnauthorizedPage from "./pages/error/UnauthorizedPage";

import APITestPage from "./pages/APITestPage";

// New Pages Imports
import ReportsPage from "./pages/admin/ReportsPage";
import SupportTicketsPage from "./pages/admin/SupportTicketsPage";
import AddressBookPage from "./pages/sender/AddressBookPage";
import BillingPage from "./pages/sender/BillingPage";
import OrderHistoryPage from "./pages/receiver/OrderHistoryPage";
import SavedAddressesPage from "./pages/receiver/SavedAddressesPage";
import DeliveryPreferencesPage from "./pages/receiver/DeliveryPreferencesPage";

export const routes: RouteConfig[] = [

  {
    path: "/status-history",
    element: <StatusHistoryPage />,
    layout: true,
  },
  {
    path: "/",
    element: <HomePage />,
    layout: true,
  },
  {
    path: "/track",
    element: <TrackPage />,
    layout: true,
  },
  {
    path: "/contact",
    element: <ContactPage />,
    layout: true,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicyPage />,
    layout: true,
  },
  {
    path: "/terms",
    element: <TermsOfServicePage />,
    layout: true,
  },
  {
    path: "/cookie-policy",
    element: <CookiePolicyPage />,
    layout: true,
  },

  {
    path: "/login",
    element: <LoginPage />,
    layout: true,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    layout: true,
  },
  {
    path: "/auth/google/success",
    element: <GoogleAuthCallback />,
    layout: false,
  },
  {
    path: "/debug-auth",
    element: <DebugAuthPage />,
    layout: true,
  },

  {
    path: "/admin",
    element: <AdminDashboard />,
    protected: true,
    allowedRoles: ["admin"],
    layout: true,
  },
  {
    path: "/sender",
    element: <SenderDashboard />,
    protected: true,
    allowedRoles: ["sender"],
    layout: true,
  },
  {
    path: "/receiver",
    element: <ReceiverDashboard />,
    protected: true,
    allowedRoles: ["receiver"],
    layout: true,
  },

  {
    path: "/dashboard",
    element: <SenderDashboard />,
    protected: true,
    allowedRoles: ["sender"],
    layout: true,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    protected: true,
    allowedRoles: ["admin"],
    layout: true,
  },
  {
    path: "/sender/dashboard",
    element: <SenderDashboard />,
    protected: true,
    allowedRoles: ["sender"],
    layout: true,
  },
  {
    path: "/receiver/dashboard",
    element: <ReceiverDashboard />,
    protected: true,
    allowedRoles: ["receiver"],
    layout: true,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    protected: true,
    layout: true,
  },

  // Admin Routes
  {
    path: "/admin/parcels",
    element: <ParcelManagementPage />,
    protected: true,
    allowedRoles: ["admin"],
    layout: true,
  },
  {
    path: "/admin/users",
    element: <UserManagementPage />,
    protected: true,
    allowedRoles: ["admin"],
    layout: true,
  },
  {
    path: "/admin/settings",
    element: <SystemSettingsPage />,
    protected: true,
    allowedRoles: ["admin"],
    layout: true,
  },
  {
    path: "/admin/reports",
    element: <ReportsPage />,
    protected: true,
    allowedRoles: ["admin"],
    layout: true,
  },
  {
    path: "/admin/support",
    element: <SupportTicketsPage />,
    protected: true,
    allowedRoles: ["admin"],
    layout: true,
  },

  // Sender Routes
  {
    path: "/sender/create-parcel",
    element: <CreateParcelPage />,
    protected: true,
    allowedRoles: ["sender"],
    layout: true,
  },
  {
    path: "/sender/parcels",
    element: <SenderParcelsPage />,
    protected: true,
    allowedRoles: ["sender"],
    layout: true,
  },
  {
    path: "/sender/statistics",
    element: <SenderStatisticsPage />,
    protected: true,
    allowedRoles: ["sender"],
    layout: true,
  },
  {
    path: "/sender/addresses",
    element: <AddressBookPage />,
    protected: true,
    allowedRoles: ["sender"],
    layout: true,
  },
  {
    path: "/sender/billing",
    element: <BillingPage />,
    protected: true,
    allowedRoles: ["sender"],
    layout: true,
  },

  // Receiver Routes
  {
    path: "/receiver/track",
    element: <TrackPage />,
    protected: true,
    allowedRoles: ["receiver"],
    layout: true,
  },

  {
    path: "/receiver/profile",
    element: <ProfilePage />,
    protected: true,
    allowedRoles: ["receiver"],
    layout: true,
  },
  {
    path: "/receiver/history",
    element: <OrderHistoryPage />, // Updated to use dedicated page
    protected: true,
    allowedRoles: ["receiver"],
    layout: true,
  },
  {
    path: "/receiver/addresses",
    element: <SavedAddressesPage />,
    protected: true,
    allowedRoles: ["receiver"],
    layout: true,
  },
  {
    path: "/receiver/preferences",
    element: <DeliveryPreferencesPage />,
    protected: true,
    allowedRoles: ["receiver"],
    layout: true,
  },

  {
    path: "/api-test",
    element: <APITestPage />,
    layout: true,
  },

  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
    layout: true,
  },
  {
    path: "*",
    element: <NotFoundPage />,
    layout: true,
  },
];

export const shouldIncludeRoute = (path: string): boolean => {

  if (process.env.NODE_ENV === 'production' && path === '/api-test') {
    return false;
  }
  if (process.env.NODE_ENV === 'production' && path === '/debug-auth') {
    return false;
  }
  return true;
};
