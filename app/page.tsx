import Nav from "./component/Nav";
import HeroSection from "./component/HeroSection";
import PaymentOptions from "./component/PayCards";
import HeroFeatureSection from "./component/HeroFeatures";
import FAQ from "./component/FAQ";
import Footer from "./component/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-full selection:bg-blue-300 scroll-smooth tracking-wide">
      <div className="flex flex-col items-center scroll-smooth">
        <Nav />

        <HeroSection />

        <DashboardPreview />

        <PaymentOptions />

        <HeroFeatureSection />

        <FAQ />
      </div>

      <Footer />
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="w-[90%] max-w-5xl mx-auto my-12 md:my-16 flex justify-center font-sans select-none">
      {/* Outer App Frame Container */}
      <div className="relative w-full bg-white border border-zinc-200/80 rounded-xs p-2 md:p-3 shadow-2xs transition-all duration-300 hover:border-zinc-300">
        
        {/* App Window Top Header Bar */}
 

        {/* Dashboard Image Preview Wrapper */}
        <div className="relative w-full overflow-hidden rounded-2xs bg-zinc-50 aspect-[1/1] border border-zinc-100">
          <Image
            src="/dash_Img2.jpeg"
            alt="Luen Dashboard Preview"
            fill
            sizes=""
            priority
            className="object-cover object-top hover:object-bottom transition-all duration-1000 ease-in-out"
          />
        </div>

      </div>
    </div>
  );
}