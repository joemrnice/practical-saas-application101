import { Button } from "@/components/ui/Button";

type NavbarProps = {
  email: string;
};

export function Navbar({ email }: NavbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
      <p className="text-sm text-zinc-600">Signed in as {email}</p>
      <form action="/auth/signout" method="post">
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </header>
  );
}
