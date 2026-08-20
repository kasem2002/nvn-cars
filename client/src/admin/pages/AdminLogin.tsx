import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useLoginMutation } from "@/services/api";
import { credentialsSet } from "@/store/authSlice";

export function AdminLogin() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [login, { isLoading, error }] = useLoginMutation();

  if (token) return <Navigate to="/admin" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(credentialsSet({ ...result, remember }));
    } catch {
      // error state below reflects the failure
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0C] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-white/10 bg-[#131315] p-8">
        <div className="mb-8 text-center">
          <span className="font-display text-3xl tracking-wide text-white">
            NV<span className="text-nvn-red">N</span>
          </span>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/40">Admin Dashboard</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-white/15 bg-[#0B0B0C] px-3 py-2.5 text-sm text-white outline-none focus:border-nvn-red"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-white/15 bg-[#0B0B0C] px-3 py-2.5 text-sm text-white outline-none focus:border-nvn-red"
            />
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-2 text-xs text-white/60 select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-nvn-red"
          />
          Keep me signed in
        </label>

        {error && <p className="mt-4 text-sm text-nvn-red">Invalid email or password.</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-md bg-nvn-red py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-nvn-black disabled:opacity-60"
        >
          {isLoading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
