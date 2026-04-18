import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DemoPopup from "@/website/components/DemoPopup";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navigation />
        <main className="grow">{children}</main>
        <Footer />
        <DemoPopup />
      </div>
    </SmoothScrollProvider>
  );
}
