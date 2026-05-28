import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DemoPopup from "@/website/components/DemoPopup";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import SaleBanner from "@/components/SaleBanner";
import NavigationProgress from "@/components/NavigationProgress";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <NavigationProgress />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#0e2b49] focus:text-[#c0a84f] focus:font-semibold focus:text-sm focus:shadow-lg"
      >
        Skip to main content
      </a>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <SaleBanner />
        <Navigation />
        <main id="main-content" className="grow">
          {children}
        </main>
        <Footer />
        <DemoPopup />
      </div>
    </SmoothScrollProvider>
  );
}
