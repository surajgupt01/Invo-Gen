import { Descriptions } from "../Elements";
import Tempelate from "../Icons/Tempelate";
import PDF from "../Icons/PDF";
import Share from "../Icons/Share";
import History from "../Icons/History";
import { ReactNode } from "react";


export default function Features() {
  // const currency: any = {
  //   Rupee: <Rupee />,
  //   Dollar: <Dollar />,
  //   Yen: <Yen />,
  //   Euro: <Euro />,
  // };

  interface Prop {

  logo : keyof LogoProp,
  curr:string,
  title : string,
  desc : string

  
}
  interface LogoProp{
    tempelate : ReactNode,
    PDF : ReactNode,
    History : ReactNode,
    share : ReactNode
  }
  const logos: LogoProp = {
    tempelate: <Tempelate />,
    PDF: <PDF />,
    History: <History />,
    share: <Share />
  };

  return (
    <div className="w-full  p-4 md:flex-row flex flex-col  justify-center items-center">
      {Descriptions.map((e:Prop ) => (
        <div
          key={e.title}
          className="border-1 p-2 border-gray-200  w-65 h-57 rounded-lg m-4"
        >
          <div className="mt-4 bg-gray-100 p-2 rounded-md w-15">
            {logos[e.logo]}
          </div>
          <div className="mt-8">{e.title}</div>
          <div className="mt-2 text-gray-400 text-md">{e.desc}</div>
        </div>
      ))}
    </div>
  );
}
