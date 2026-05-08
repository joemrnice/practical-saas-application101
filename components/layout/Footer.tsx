import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-600 md:flex-row">
        <p>© {new Date().getFullYear()} AI SaaS. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      </div>
    </footer>
  );
}
