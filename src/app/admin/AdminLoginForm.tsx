"use client";

export function AdminLoginForm() {
  return (
    <form action="/api/admin/login" method="post" className="mt-6 space-y-4">
      <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
        Password
        <input
          type="password"
          name="password"
          required
          className="input-field mt-1.5 normal-case tracking-normal"
        />
      </label>
      <button type="submit" className="btn-navy w-full">
        Sign in
      </button>
    </form>
  );
}
