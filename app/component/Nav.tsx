import Link from "next/link";
import Logo from "../Icons/Logo";


interface NavProp{
  textColor : string
}
export function NavLogo({textColor} : NavProp) {
  return (
    <div className="  w-full cursor-pointer font-bold sm:text-lg text-xs flex items-center ">
      <Logo textColor = {textColor}/>
      <span className={`${textColor}`}>
        Ledg
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-400">
          erly
        </span>{" "}
      </span>
    </div>
  );
}

export default function Nav() {
  return (
    <div className="flex justify-evenly  w-full  p-1 px-4   fixed       bg-gray-300/10 backdrop-blur-sm  z-100">
      <NavLogo textColor = "text-black"/>
      <div className="flex p-2   w-full justify-end items-center">
        {/* <li className="cursor-pointer hover:text-gray-700">Home</li> */}
        <Link href={'#PriceSection'} className="md:text-xs text-xs sm:mr-4 mr-2 hover:bg-gray-200 p-2 rounded-full cursor-pointer text-shadow-xs tracking-wide ease-in-out duration-500 font-semibold flex justify-center items-center">
          {`go`}<span className="text-teal-400 ">pro</span>
        </Link>
        <div>
          <Link
            href={"/signin"}
            className="px-3 w-20 h-9 hover:bg-gray-800 ease-in-out duration-300 cursor-pointer bg-black rounded-full text-xs  shadow-gray-800 text-white font-semibold flex justify-center items-center"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
