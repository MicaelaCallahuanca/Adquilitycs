import { TopNav } from "@/components/TopNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-6">
        {children}
      </main>
    </div>
  );
}
