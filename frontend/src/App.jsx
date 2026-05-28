import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { News } from "./pages/News.jsx";
import { NewsDetail } from "./pages/NewsDetail.jsx";
import { ContentPage } from "./pages/ContentPage.jsx";
import { Partners } from "./pages/Partners.jsx";
import { Contact } from "./pages/Contact.jsx";
import { AdminLogin } from "./pages/AdminLogin.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { getToken } from "./services/api.js";

function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route element={<Layout compact={isAdmin} />}>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/overview" element={<ContentPage slug="overview" />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/management" element={<ContentPage slug="management" />} />
        <Route path="/objectives" element={<ContentPage slug="objectives" />} />
        <Route path="/outcomes" element={<ContentPage slug="outcomes" />} />
        <Route path="/documents" element={<ContentPage slug="documents" />} />
        <Route path="/courses" element={<ContentPage slug="courses" />} />
        <Route path="/work-packages" element={<ContentPage slug="work-packages" />} />
        <Route path="/deliverables" element={<ContentPage slug="deliverables" />} />
        <Route path="/milestones" element={<ContentPage slug="milestones" />} />
        <Route path="/events" element={<ContentPage slug="events" />} />
        <Route path="/updates" element={<ContentPage slug="updates" />} />
        <Route path="/downloads" element={<ContentPage slug="downloads" />} />
        <Route path="/case-studies" element={<ContentPage slug="case-studies" />} />
        <Route path="/multimedia" element={<ContentPage slug="multimedia" />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}
