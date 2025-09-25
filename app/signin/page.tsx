import Link from "next/link";
import Google from "../Icons/Google";
import Left from "../Icons/Left";
import Logo from "../Icons/Logo";

export default function SignIn() {
  return (
    <div className="p-4  w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex  justify-center  items-center">
       
       <div className="flex shadow-lg shadow-gray-400 rounded-xl w-full h-full">
      <div className="w-full h-full rounded-l-lg bg-gradient-to-br from-teal-400 via-cyan-500 to-green-600
 flex flex-col justify-center items-center ">
        <h1 className=" font-bold mb-4 text-gray-800 text-9xl text-left ">Invoice<br></br>Gen</h1>
        <p className="text-lg text-blue-100 max-w-md text-left font-semibold">
          Manage, track, and send invoices with ease.  
          Stay on top of your business <br></br> finances anytime, anywhere.
        </p>
      </div>

      <div className="w-full  h-full flex justify-center items-center relative">
        <Link href={"/"} className="absolute top-5 left-5 text-gray-700 hover:text-black cursor-pointer flex justify-center items-center group"><Left/>back</Link>
        <div className="  p-2 border-gray-300 border-1 shadow-md rounded-lg w-100 h-120 backdrop-blur-md  bg-white/90  flex flex-col items-center justify-center">
          <p className="font-semibold w-60 text-center mb-4 text-md text-gray-600">
            Welcome back — securely sign in to manage your invoices. 
          </p>
          <input
            className="w-80 p-2 rounded-md border-1 border-gray-300 outline-gray-300 m-2 text-gray-700 "
            placeholder="email "
            type="email"
          ></input>
          <input
            className="w-80 p-2 rounded-md border-1 border-gray-300 m-2 text-gray-700 outline-gray-300 "
            placeholder="password "
            type="password"
          ></input>
          <div className="text-xs hover:text-black text-gray-400 cursor-pointer w-75 text-right ">Forgot Password</div>
          <button className="bg-gradient-to-r from-emerald-600 to-cyan-600 font-semibold text-center rounded-lg shadow-md cursor-pointer hovera:from-emerald-700 hover:to-cyan-800 transition-all duration-500 ease-in-out shadow-gray-200 text-white px-25 py-2 m-2">
            Login
          </button>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-2px bg-gray-200"></div>
          </div>
          <button className="bg-white  hover:border-gray-400 border-1 border-gray-200 font-semibold text-center rounded-lg shadow-md cursor-pointer transition-all duration-500 ease-in-out shadow-gray-200  px-15 py-2 m-2 text-black text-sm flex justify-center items-center ">
            <Google /> Continue with Google
          </button>
          <div className="mt-4">
            Don't have an account?{" "}
            <span className="text-blue-500 cursor-pointer hover:text-blue-700">
              SignIn
            </span>
          </div>
        </div>
      </div>
      </div>

    </div>
  );
}
