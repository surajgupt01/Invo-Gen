export default function Loading() {
  return (
    <div className=" flex gap-2  border-gray-200 rounded-xl border h-full w-full p-4   mt-2 overflow-hidden">
      <div className="overflow-y-auto bg-slate-300 border-slate-100 animate-pulse border rounded-2xl custom-scrollbar scroll-smooth w-full">
        {/* <div className="font-semibold text-gray-800 border-b-1 border-gray-300 w-full  p-2">
          Templates
        </div> */}

        <div className="w-full h-full  p-6 grid grid-cols-4 gap-y-8 gap-x-8"></div>
      </div>

      <div className="overflow-y-auto bg-slate-300 border-slate-100 animate-pulse border rounded-2xl custom-scrollbar scroll-smooth w-full flex flex-col items-center ">
        {/* <div className="font-semibold text-gray-800 border-b-1 border-gray-300 w-full  p-2">
          Previews
        </div> */}

        <div className="w-full h-full flex justify-center items-center   p-4"></div>
      </div>
    </div>
  );
}
