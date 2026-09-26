import Navigation from "@/shared/components/Navigation";
import Footer from "@/shared/components/Footer";
import DemoPopup from "@/modules/demo-bookings/components/DemoPopup";
import SmoothScrollProvider from "@/shared/components/providers/SmoothScrollProvider";
import NavigationProgress from "@/shared/components/NavigationProgress";

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
        {/* Summer Sale banner hidden for now — to bring it back, re-import
            SaleBanner from "@/shared/components/SaleBanner" and render it here. */}
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
