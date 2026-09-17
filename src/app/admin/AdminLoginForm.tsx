"use client";

export function AdminLoginForm() {
  return (
    <form action="/api/admin/login" method="post" className="mt-6 space-y-3">
      <label className="block text-xs font-medium text-slate-600">
        Password
        <input
          type="password"
          name="password"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
      >
        Sign in
      </button>
    </form>
  );
}
