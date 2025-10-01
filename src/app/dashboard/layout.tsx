import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ToastProvider } from "@/contexts/ToastContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <ToastProvider>
      <div className="h-screen flex overflow-hidden bg-gray-50">
        <Sidebar />

        <div className="flex flex-col w-0 flex-1 overflow-hidden lg:ml-64">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="h-full">
              <div className="h-full px-4 sm:px-6 lg:px-8 py-6">
                <div className="h-full max-w-none">{children}</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
