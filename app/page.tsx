import Nav from "./component/Nav";
import HeroSection from "./component/HeroSection";
import PaymentOptions from "./component/PayCards";
import HeroFeatureSection from "./component/HeroFeatures";
import FAQ from "./component/FAQ";
import Footer from "./component/Footer";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export default function Home() {

  return (
    <div className="w-full h-full selection:bg-blue-300 scroll-smooth tracking-wide">
      <div className="flex flex-col items-center scroll-smooth">
        <Nav />

        <HeroSection />

        {/* <DashboardPreview /> */}

        <PaymentOptions/>

        <HeroFeatureSection />

        <FAQ />
      </div>

      <Footer />
    </div>
  );
}

function DashboardPreview() {
  return (
    /* Standardized to w-full max-w-5xl px-4 to match HeroSection exactly */
    <div className="w-full max-w-5xl mx-auto px-4 my-10 md:my-14 flex justify-center font-sans select-none">
      
      {/* Outer App Frame Container */}
    
        {/* App Window Top Header Bar */}
     

        {/* Dashboard Image Preview Wrapper (aspect-[16/10] on desktop, square on mobile if needed) */}
        <div className="relative w-full overflow-hidden rounded-xs bg-zinc-50 aspect-[1/1]  border border-zinc-100">
          <Image
            src="/dash_Img2.jpeg"
            alt="Luen Dashboard Preview"
            fill
           
            priority
            className="object-cover object-top hover:object-bottom transition-all duration-1000 ease-in-out"
          />
        </div>

      {/* </div> */}
    </div>
  );
}