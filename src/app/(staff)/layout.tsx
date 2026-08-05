import { SignOutButton } from "./sign-out-button";

export default function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <span className="text-lg font-semibold text-primary">Zincuenta</span>
        <SignOutButton />
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
