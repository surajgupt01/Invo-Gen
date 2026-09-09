import Nav from "./component/Nav";
import HeroSection from "./component/HeroSection";
import PaymentOptions from "./component/PayCards";
import HeroFeatureSection from "./component/HeroFeatures";
import FAQ from "./component/FAQ";
import Footer from "./component/Footer";

export default function Home() {
  return (
    <div className="w-full h-full selection:bg-blue-300 scroll-smooth tracking-wide">
      <div className="flex flex-col items-center scroll-smooth">
        <Nav />

        <HeroSection />

        {/* <DashboardPreview /> */}

        <PaymentOptions />

        <HeroFeatureSection />

        <FAQ />
      </div>

      <Footer />
    </div>
  );
}
