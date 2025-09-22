import Features from "./component/Features";
import Footer from "./component/Footer";
import HeroSection from "./component/HeroSection";
import Nav from "./component/Nav";

export default function Home() {
  return (
    <div className="w-full h-full">
      <div className="p-4 bg-linear-to-b from-white to-neutral-50 flex flex-col items-center scroll-smooth  ">
        <Nav />

        <HeroSection />

        <div className="font-bold flex-col md:text-4xl sm:text-3xl text-xl w-full flex items-center justify-center mt-10 text-gray-600">
          <p className="w-full text-center">Everything You Need to Create Professional Invoices</p>

          <p className="md:w-150 sm:w-120 w-80 text-center mt-6 font-light sm:text-lg text-sm">
            Our invoice generator provides all the tools you need to create,
            manage, and send professional invoices.
          </p>
        </div>

        <Features />
      </div>

      <Footer />
    </div>
  );
}
