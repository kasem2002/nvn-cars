import { NavLink, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loggedOut } from "@/store/authSlice";

const NAV = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/before-after", label: "Before / After" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/locations", label: "Locations" },
  { to: "/admin/settings", label: "Settings" },
];

export function AdminLayout() {
  const dispatch = useAppDispatch();
  const admin = useAppSelector((s) => s.auth.admin);

  return (
    <div className="flex min-h-screen bg-[#0B0B0C] text-white/90">
      <aside className="hidden w-64 flex-col border-r border-white/10 bg-[#111113] md:flex">
        <div className="border-b border-white/10 px-6 py-5">
          <span className="font-display text-2xl tracking-wide">
            NV<span className="text-nvn-red">N</span> <span className="text-xs font-sans font-normal text-white/40">Admin</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-md px-4 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-nvn-red/15 text-nvn-red" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-xs text-white/40">{admin?.email}</p>
          <button
            onClick={() => dispatch(loggedOut())}
            className="mt-2 w-full rounded-md border border-white/10 px-4 py-2 text-left text-sm text-white/60 hover:border-nvn-red hover:text-nvn-red"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-white/10 bg-[#111113] px-6 py-4 md:hidden">
          <span className="font-display text-xl">NVN Admin</span>
          <button onClick={() => dispatch(loggedOut())} className="text-xs text-white/60">
            Logout
          </button>
        </header>
        <main className="p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
