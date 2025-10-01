export default function SignSideBar() {
  return (
    <div
      className="w-full h-full rounded-l-lg bg-gradient-to-br from-teal-400 via-cyan-500 to-green-600
 hidden flex-col justify-center items-center p-2 md:p-4 [@media(min-width:930px)]:flex   "
    >
      <h1 className=" font-bold mb-4 text-gray-800  text-9xl  text-left ">
        Invoice<br></br>Gen
      </h1>
      <p className="text-lg text-blue-100 max-w-md text-left font-semibold">
        Manage, track, and send invoices with ease. Stay on top of your business{" "}
        <br></br> finances anytime, anywhere.
      </p>
    </div>
  );
}
