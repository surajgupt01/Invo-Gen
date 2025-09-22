import { Descriptions } from "../Elements";
import Dollar from "../Icons/Dollor";
import Yen from "../Icons/Yen";
import Euro from "../Icons/Euro";
import Tempelate from "../Icons/Tempelate";
import PDF from "../Icons/PDF";
import Share from "../Icons/Share";
import History from "../Icons/History";
import Rupee from "../Icons/Rupee";

export default function Features() {
  const currency: any = {
    Rupee: <Rupee />,
    Dollar: <Dollar />,
    Yen: <Yen />,
    Euro: <Euro />,
  };
  const logos: any = {
    tempelate: <Tempelate />,
    PDF: <PDF />,
    History: <History />,
    share: <Share />,
  };
  return (
    <div className="w-full  p-4 md:flex-row flex flex-col  justify-center items-center">
      {Descriptions.map((e: any) => (
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
