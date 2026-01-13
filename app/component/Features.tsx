"use client";

import { Descriptions } from "../Elements";
import Tempelate from "../Icons/Tempelate";
import PDF from "../Icons/PDF";
import Share from "../Icons/Share";
import History from "../Icons/History";
import { ReactNode } from "react";

// export default function Features() {
//   // const currency: any = {
//   //   Rupee: <Rupee />,
//   //   Dollar: <Dollar />,
//   //   Yen: <Yen />,
//   //   Euro: <Euro />,
//   // };

//   interface Prop {
//     logo: keyof LogoProp;
//     curr: string;
//     title: string;
//     desc: string;
//   }
//   interface LogoProp {
//     template: ReactNode;
//     PDF: ReactNode;
//     History: ReactNode;
//     share: ReactNode;
//   }
//   const logos: LogoProp = {
//     template: <Tempelate colorName="text-rose-500" s="10" />,
//     PDF: <PDF />,
//     History: <History />,
//     share: <Share />,
//   };

//   const styles = [
//   "z-30 scale-100 translate-y-0",
//   "z-20 scale-95 translate-y-3",
//   "z-10 scale-90 translate-y-6",
// ];

//   return (
//     <div
//       className="   p-4  "
//     >
//       {Descriptions.map((e) => (
//         <div
//           key={e.title}
//           className="border p-6 m-4 row-span-2 bg-white
//                  hover:scale-105 transition
//                  shadow-lg rounded-lg text-sm"
//         >
//           <div className="flex justify-center">{logos[e.logo]}</div>
//           <h3 className="mt-4 font-semibold">{e.title}</h3>
//           <p className="mt-2 text-xs text-gray-500 text-left">{e.desc}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

import { useEffect, useState } from "react";

const initialCards = [
  { id: 1, title: "Invoice #1021", color: "bg-white" },
  { id: 2, title: "Invoice #1022", color: "bg-gray-50" },
  { id: 3, title: "Invoice #1023", color: "bg-gray-100" },
];

  interface Prop {
    logo: keyof LogoProp;
    curr: string;
    title: string;
    desc: string;
  }
  interface LogoProp {
    template: ReactNode;
    PDF: ReactNode;
    History: ReactNode;
    share: ReactNode;
  }
  const logos: LogoProp = {
    template: <Tempelate colorName="text-rose-500" s="10" />,
    PDF: <PDF />,
    History: <History />,
    share: <Share />,
  };

export default function Features() {
  const [cards, setCards] = useState(Descriptions);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) => {
        const copy = [...prev];
        copy.push(copy.shift()!);
        return copy;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative md:w-80 w-full  md:h-52 h-70 p-0   " id="Features">
      {cards.map((card, i) => (
        <div
          key={card.title}
          className={`
            absolute inset-0 rounded-xl border -rotate-8  
            shadow-lg md:p-6 p-4 m-auto
            transition-all duration-700 ease-in-out sm:h-60 sm:w-70 h-50 w-50 
            ${i === 0 && "z-30 scale-100 translate-y-0 translate-x-0 -rotate-8 bg-yellow-50"}
            ${i === 1 && "z-20 scale-95 translate-y-3 translate-x-3 rotate-0 bg-white/60"}
            ${i === 2 && "z-10 scale-90 translate-y-6 translate-x-6 rotate-8 bg-white/40"}
            ${i === 3 && "z-10 scale-90 translate-y-9 translate-x-6 rotate-12 bg-white/20"}
            
          `}
        >
          {/* <h3 className="font-semibold text-lg">{card.title}</h3> */}
           <div className="flex justify-center">{logos[card.logo]}</div>
           <h3 className="sm:mt-4 mt-2 font-semibold sm:text-sm text-xs">{card.title}</h3>
           <p className="mt-2 sm:text-xs text-[10px] text-gray-500 text-left">{card.desc}</p>
        </div>
      ))}
    </div>
  );
}
