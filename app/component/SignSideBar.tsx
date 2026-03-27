export default function SignSideBar() {
  return (
    <div
      className="relative w-full h-full rounded-l-lg bg-gradient-to-br from-teal-400 via-cyan-500 to-green-600
 hidden flex-col justify-center items-start p-2 md:p-4 [@media(min-width:930px)]:flex  overflow-hidden  "
    >
      <h1 className=" font-bold mb-4 text-gray-800  text-9xl  ">
        Luen
      </h1>
      <p className="text-lg text-white max-w-md  font-normal tracking-wide">
        Manage, track, and send invoices with ease. Stay on top of your business{" "}
        finances anytime, anywhere.
      </p>
      <div className=" bg-white/10 absolute w-150 h-150 rounded-full top-80 left-60"></div>
    </div>
  );
}
