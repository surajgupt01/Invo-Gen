import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { currencies } from "../constants/currency";

export default function CurrencySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className="
      w-24 text-xs bg-neutral-900
      rounded-xs
      text-gray-400
      border border-gray-800
      hover:border-emerald-500
      focus:border-emerald-600
      focus:ring-1 focus:ring-emerald-500
    "
      >
        <SelectValue placeholder="Currency" />
      </SelectTrigger>

      <SelectContent
        side="top"
        sideOffset={6}
        className="bg-neutral-900 border-neutral-800 
  overflow-y: auto;

      max-h-40
  
    "
      >
        {currencies.map((e) => (
          <SelectItem
            key={e.code}
            value={e.code + " " + e.symbol}
            className="text-gray-400
          text-xs
          rounded-xs
          data-[highlighted]:bg-emerald-800
          data-[highlighted]:text-gray-300
        "
          >
            {e.code} {e.symbol}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
