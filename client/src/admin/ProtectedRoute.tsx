import { PropsWithChildren, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useGetMeQuery } from "@/services/api";
import { adminLoaded, loggedOut } from "@/store/authSlice";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const token = useAppSelector((s) => s.auth.token);
  const dispatch = useAppDispatch();
  const { data, error, isLoading } = useGetMeQuery(undefined, { skip: !token });

  useEffect(() => {
    if (data) dispatch(adminLoaded(data));
    if (error) dispatch(loggedOut());
  }, [data, error, dispatch]);

  if (!token) return <Navigate to="/admin/login" replace />;
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0B0C] text-sm text-white/60">Loading…</div>
    );
  }
  if (error) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}
