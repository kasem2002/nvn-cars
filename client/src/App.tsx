import { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { Home } from "@/pages/Home";

const AdminLayout = lazy(() => import("@/admin/AdminLayout").then((m) => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import("@/admin/pages/AdminLogin").then((m) => ({ default: m.AdminLogin })));
const AdminOverview = lazy(() => import("@/admin/pages/AdminOverview").then((m) => ({ default: m.AdminOverview })));
const AdminBookings = lazy(() => import("@/admin/pages/AdminBookings").then((m) => ({ default: m.AdminBookings })));
const AdminServices = lazy(() => import("@/admin/pages/AdminServices").then((m) => ({ default: m.AdminServices })));
const AdminGallery = lazy(() => import("@/admin/pages/AdminGallery").then((m) => ({ default: m.AdminGallery })));
const AdminBeforeAfter = lazy(() =>
  import("@/admin/pages/AdminBeforeAfter").then((m) => ({ default: m.AdminBeforeAfter }))
);
const AdminReviews = lazy(() => import("@/admin/pages/AdminReviews").then((m) => ({ default: m.AdminReviews })));
const AdminLocations = lazy(() => import("@/admin/pages/AdminLocations").then((m) => ({ default: m.AdminLocations })));
const AdminSettings = lazy(() => import("@/admin/pages/AdminSettings").then((m) => ({ default: m.AdminSettings })));
const ProtectedRoute = lazy(() => import("@/admin/ProtectedRoute").then((m) => ({ default: m.ProtectedRoute })));

function AdminFallback() {
  return <div className="flex h-screen items-center justify-center bg-[#0B0B0C] text-sm text-white/60">Loading…</div>;
}

export default function App() {
  const { i18n } = useTranslation();
  const language = useAppSelector((s) => s.language.language);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    if (i18n.language !== language) i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<AdminFallback />}>
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          </Suspense>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="before-after" element={<AdminBeforeAfter />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="locations" element={<AdminLocations />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
