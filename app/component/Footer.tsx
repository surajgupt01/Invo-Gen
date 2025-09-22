import Logo from "../Icons/Logo";

export default function Footer() {
  return (
    <div className=" top-full w-full bg-black min-h-100 text-gray-500 text-sm p-4 flex sm:flex-row flex-col justify-between">
      <div className="mt-20 ml-10">
        <p className="text-lg font-semibold flex justify-center items-center">
          <div className="scale-80">
            <Logo></Logo>
          </div>
          Invoice-Gen
        </p>
        <p className="md:ml-2 flex justify-center">Professional Invoices</p>
      </div>

      <div className="flex flex-col items-center sm:w-[50%] w-full mt-20">
        <div className="flex w-full justify-evenly">
          <div>
            <p className="cursor-pointer hover:text-gray-300 m-2">About</p>{" "}
            <p className="cursor-pointer m-2 hover:text-gray-300">Features</p>{" "}
            <p className="cursor-pointer m-2 hover:text-gray-300">Pricing</p>{" "}
            <p className="cursor-pointer m-2 hover:text-gray-300">Contact</p>{" "}
            <p className="cursor-pointer hover:text-gray-300 m-2">Blog</p>{" "}
            <p className="cursor-pointer m-2 hover:text-gray-300">About</p>
          </div>
          <div>
            <p className="cursor-pointer hover:text-gray-300 m-2">
              Documentation
            </p>{" "}
            <p className="cursor-pointer m-2 hover:text-gray-300">FAQ</p>{" "}
            <p className="cursor-pointer m-2 hover:text-gray-300">Support</p>
          </div>
          <div>
            <p className="cursor-pointer m-2 hover:text-gray-300">X(Twitter)</p>{" "}
            <p className="cursor-pointer m-2 hover:text-gray-300">LinkedIn</p>{" "}
            <p className="cursor-pointer m-2 hover:text-gray-300">YouTube</p>
          </div>
        </div>
        <div className="flex justify-center items-center sm:flex-row flex-col  sm:justify-evenly sm:w-[70%] w-full mt-16 text-xs">
          <p>© 2025 Invoice-Gen. All rights reserved.</p>
          <p>Privacy Policy</p>
          <p>Terms of Use</p>
        </div>
      </div>
    </div>
  );
}
