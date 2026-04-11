import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DemoPopup from "@/website/components/DemoPopup";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navigation />
      <main className="grow">{children}</main>
      <Footer />
      <DemoPopup />
    </div>
  );
}
