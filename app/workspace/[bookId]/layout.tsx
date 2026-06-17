import Sidebar from "@/components/workspace/Sidebar";
import BookInitializer from "@/components/workspace/BookInitializer";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ bookId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BookInitializer bookId={resolvedParams.bookId} />
      <Sidebar />
      <main className="flex-1 h-screen overflow-hidden">{children}</main>
    </div>
  );
}
