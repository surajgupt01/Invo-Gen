import { useState } from "react";
import {
  useItemsStore,
  UNITS, GST_RATES, CURRENCIES, TAX_PRESETS,
} from "../../store/InvoiceTabel";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtNum(n: string | number, locale: string): string {
  return parseFloat(String(n || "0")).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ItemsTable() {
  const [showPresets, setShowPresets] = useState(false);

  // ── Pull everything from the store ──────────────────────────────────────────
  const mode        = useItemsStore(s => s.mode);
  const txnType     = useItemsStore(s => s.txnType);
  const currency    = useItemsStore(s => s.currency);
  const taxConfig   = useItemsStore(s => s.taxConfig);
  const Items       = useItemsStore(s => s.Items);
  const subTotal    = useItemsStore(s => s.subTotal);
  const totalCgst   = useItemsStore(s => s.totalCgst);
  const totalSgst   = useItemsStore(s => s.totalSgst);
  const totalIgst   = useItemsStore(s => s.totalIgst);
  const totalTax    = useItemsStore(s => s.totalTax);
  const Total       = useItemsStore(s => s.Total);

  const setMode       = useItemsStore(s => s.setMode);
  const setTxnType    = useItemsStore(s => s.setTxnType);
  const setCurrency   = useItemsStore(s => s.setCurrency);
  const setTaxConfig  = useItemsStore(s => s.setTaxConfig);
  const changeHandler = useItemsStore(s => s.changeHandler);
  const addRow        = useItemsStore(s => s.addRow);
  const delRow        = useItemsStore(s => s.delRow);

  // ── Display helpers ─────────────────────────────────────────────────────────
  const sym    = mode === "india" ? "₹" : currency.symbol;
  const locale = mode === "india" ? "en-IN" : currency.locale;
  const fmt    = (n: string | number) => fmtNum(n, locale);

  const applyPreset = (p: typeof TAX_PRESETS[0]) => {
    setTaxConfig({ name: p.name, rate: p.rate });
    setShowPresets(false);
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  const inputCls =
    "w-full p-1.5 font-light border border-neutral-800 bg-neutral-900 text-xs rounded-sm outline-0 focus:border-neutral-600 text-neutral-200 placeholder-neutral-600";
  const selectCls =
    "w-full p-1.5 font-light border border-neutral-800 bg-neutral-900 text-xs rounded-sm outline-0 focus:border-neutral-600 text-neutral-200 cursor-pointer";

  const modeBtnCls = (m: typeof mode) =>
    `px-3 py-1 text-xs rounded-sm border transition-colors cursor-pointer font-medium ${
      mode === m
        ? "bg-neutral-700 border-neutral-500 text-neutral-100"
        : "bg-neutral-900 border-neutral-700 text-neutral-500 hover:border-neutral-600 hover:text-neutral-400"
    }`;

  const txnBtnCls = (t: typeof txnType) =>
    `px-2.5 py-1 text-xs rounded-sm border transition-colors cursor-pointer ${
      txnType === t
        ? "bg-teal-900 border-teal-700 text-teal-300"
        : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-600"
    }`;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-md border border-neutral-950 bg-neutral-950 overflow-hidden">

      {/* ── Top bar: mode switcher ────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-800 bg-neutral-900/40">
        <div className="flex items-center gap-2">
          {/* <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-neutral-500">
            <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1" />
            <path d="M4 5h6M4 7h4M4 9h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <span className="text-xs font-medium text-neutral-300">Items table</span> */}
        </div>
        <div className="flex gap-1.5">
          <button className={modeBtnCls("india")}         onClick={() => setMode("india")}>India · GST</button>
          <button className={modeBtnCls("international")} onClick={() => setMode("international")}>International</button>
        </div>
      </div>

      {/* ── Sub-bar: India txn type  OR  International tax config ─────────── */}
      {mode === "india" ? (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-800">
          <span className="text-xs text-neutral-500 mr-1">Transaction:</span>
          <button className={txnBtnCls("intra")}  onClick={() => setTxnType("intra")}>Intrastate · CGST+SGST</button>
          <button className={txnBtnCls("inter")}  onClick={() => setTxnType("inter")}>Interstate · IGST</button>
          <button className={txnBtnCls("export")} onClick={() => setTxnType("export")}>Export / exempt</button>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-2 border-b border-neutral-800 flex-wrap">

          {/* Currency */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-500">Currency:</span>
            <select
              className="p-1 text-xs border border-neutral-800 bg-neutral-900 text-neutral-200 rounded-sm outline-0 focus:border-neutral-600 cursor-pointer"
              value={currency.code}
              onChange={e => setCurrency(CURRENCIES.find(c => c.code === e.target.value) ?? CURRENCIES[0])}
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-neutral-800" />

          {/* Tax name */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-500">Tax name:</span>
            <input
              className="w-24 p-1 text-xs border border-neutral-800 bg-neutral-900 text-neutral-200 rounded-sm outline-0 focus:border-neutral-600 placeholder-neutral-600"
              placeholder="VAT"
              value={taxConfig.name}
              onChange={e => setTaxConfig({ ...taxConfig, name: e.target.value })}
            />
          </div>

          {/* Tax rate */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-500">Rate:</span>
            <div className="flex items-center border border-neutral-800 bg-neutral-900 rounded-sm overflow-hidden">
              <input
                className="w-14 p-1 text-xs bg-transparent text-neutral-200 outline-0 text-right"
                placeholder="0"
                inputMode="numeric"
                value={taxConfig.rate}
                onChange={e => setTaxConfig({ ...taxConfig, rate: e.target.value })}
              />
              <span className="px-1.5 text-xs text-neutral-500 border-l border-neutral-800">%</span>
            </div>
          </div>

          {/* Presets */}
          <div className="relative">
            <button
              className="px-2.5 py-1 text-xs rounded-sm border border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-600 transition-colors cursor-pointer"
              onClick={() => setShowPresets(v => !v)}
            >
              Presets ▾
            </button>
            {showPresets && (
              <div className="absolute top-full left-0 mt-1 z-10 bg-neutral-900 border border-neutral-700 rounded-md min-w-[160px] py-1">
                {TAX_PRESETS.map(p => (
                  <button
                    key={p.label}
                    className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 transition-colors cursor-pointer"
                    onClick={() => applyPreset(p)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reverse charge */}
          <div className="ml-auto">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" className="accent-teal-500 cursor-pointer" />
              <span className="text-xs text-neutral-500">Reverse charge</span>
            </label>
          </div>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className="overflow-auto custom-scrollbar">
        <table className="w-full table-fixed border-separate border-spacing-0 text-sm min-w-[860px]">
          <thead className="text-neutral-500 text-xs">
            <tr className="bg-neutral-900/60">
              <th className="p-2 w-[24%] font-medium text-left">Item / service</th>

              {mode === "india" && (
                <th className="p-2 w-[9%] font-medium text-left">HSN / SAC</th>
              )}

              <th className="p-2 w-[7%] font-medium text-left">Unit</th>
              <th className="p-2 w-[6%] font-medium text-left">Qty</th>
              <th className="p-2 w-[10%] font-medium text-left">Rate ({sym})</th>
              <th className="p-2 w-[6%] font-medium text-left">Disc %</th>

              {mode === "india" ? (
                <>
                  <th className="p-2 w-[7%] font-medium text-left">GST %</th>
                  {txnType === "intra" && (
                    <>
                      <th className="p-2 w-[8%] font-medium text-right text-teal-600">CGST (₹)</th>
                      <th className="p-2 w-[8%] font-medium text-right text-teal-600">SGST (₹)</th>
                    </>
                  )}
                  {txnType === "inter" && (
                    <th className="p-2 w-[16%] font-medium text-right text-blue-500" colSpan={2}>IGST (₹)</th>
                  )}
                  {txnType === "export" && (
                    <th className="p-2 w-[16%] font-medium text-right text-neutral-500" colSpan={2}>Tax exempt</th>
                  )}
                </>
              ) : (
                <th className="p-2 w-[12%] font-medium text-right text-amber-600">
                  {taxConfig.name || "Tax"} ({taxConfig.rate || "0"}%)
                </th>
              )}

              <th className="p-2 w-[11%] font-medium text-right text-neutral-300">Amount ({sym})</th>
              <th className="w-[4%]" />
            </tr>
            <tr>
              <td colSpan={14} className="border-b border-neutral-800" />
            </tr>
          </thead>

          <tbody className="text-neutral-400">
            {Items.map((item, index) => (
              <tr key={index} className="hover:bg-neutral-900/40 transition-colors">

                <td className="p-1.5">
                  <input className={inputCls} placeholder="Item name" value={item.description}
                    onChange={e => changeHandler("description", index, e.currentTarget.value)} />
                </td>

                {mode === "india" && (
                  <td className="p-1.5">
                    <input className={inputCls} placeholder="HSN" value={item.hsn}
                      onChange={e => changeHandler("hsn", index, e.currentTarget.value)} />
                  </td>
                )}

                <td className="p-1.5">
                  <select className={selectCls} value={item.unit}
                    onChange={e => changeHandler("unit", index, e.currentTarget.value)}>
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </td>

                <td className="p-1.5">
                  <input className={inputCls} placeholder="0" type="text" inputMode="numeric"
                    pattern="[0-9]*" value={item.qty}
                    onChange={e => changeHandler("qty", index, e.currentTarget.value)} />
                </td>

                <td className="p-1.5">
                  <input className={inputCls} placeholder="0.00" type="text" inputMode="numeric"
                    value={item.rate}
                    onChange={e => changeHandler("rate", index, e.currentTarget.value)} />
                </td>

                <td className="p-1.5">
                  <input className={inputCls} placeholder="0" type="text" inputMode="numeric"
                    value={item.discount}
                    onChange={e => changeHandler("discount", index, e.currentTarget.value)} />
                </td>

                {mode === "india" ? (
                  <>
                    <td className="p-1.5">
                      <select className={selectCls} value={item.gstRate}
                        onChange={e => changeHandler("gstRate", index, e.currentTarget.value)}>
                        {GST_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </td>
                    {txnType === "intra" && (
                      <>
                        <td className="p-1.5 text-right text-xs text-teal-500 font-medium pr-3">{fmt(item.cgst)}</td>
                        <td className="p-1.5 text-right text-xs text-teal-500 font-medium pr-3">{fmt(item.sgst)}</td>
                      </>
                    )}
                    {txnType === "inter" && (
                      <td className="p-1.5 text-right text-xs text-blue-400 font-medium pr-3" colSpan={2}>{fmt(item.igst)}</td>
                    )}
                    {txnType === "export" && (
                      <td className="p-1.5 text-right text-xs text-neutral-600 pr-3" colSpan={2}>—</td>
                    )}
                  </>
                ) : (
                  <td className="p-1.5 text-right text-xs text-amber-500 font-medium pr-3">
                    {parseFloat(taxConfig.rate) > 0 ? fmt(item.taxAmt) : "—"}
                  </td>
                )}

                <td className="p-1.5 text-right text-xs text-neutral-200 font-medium pr-3">{fmt(item.amt)}</td>

                <td className="p-1.5 text-center">
                  <button onClick={e => { e.preventDefault(); delRow(index); }}
                    className="text-neutral-600 hover:text-red-500 transition-colors text-xs px-1">
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Add row ──────────────────────────────────────────────────────────── */}
      <div className="px-4 py-2 border-t border-neutral-800/60">
        <button onClick={e => { e.preventDefault(); addRow(); }}
          className="flex items-center gap-1.5 text-xs text-teal-500 hover:text-teal-400 transition-colors">
          <span className="text-base leading-none">+</span> Add item
        </button>
      </div>

      {/* ── Totals ───────────────────────────────────────────────────────────── */}
      <div className="border-t border-neutral-800 px-4 py-3 flex justify-end">
        <div className="w-72 space-y-1.5 text-xs">

          <div className="flex justify-between text-neutral-400">
            <span>Subtotal</span>
            <span className="font-medium text-neutral-300">{sym}{fmt(subTotal)}</span>
          </div>

          {/* India */}
          {mode === "india" && txnType === "intra" && (
            <>
              <div className="flex justify-between text-teal-600">
                <span>CGST</span>
                <span className="font-medium">₹{fmt(totalCgst)}</span>
              </div>
              <div className="flex justify-between text-teal-600">
                <span>SGST</span>
                <span className="font-medium">₹{fmt(totalSgst)}</span>
              </div>
            </>
          )}
          {mode === "india" && txnType === "inter" && (
            <div className="flex justify-between text-blue-400">
              <span>IGST</span>
              <span className="font-medium">₹{fmt(totalIgst)}</span>
            </div>
          )}
          {mode === "india" && txnType === "export" && (
            <div className="flex justify-between text-neutral-600">
              <span>Tax</span><span>Exempt / 0%</span>
            </div>
          )}

          {/* International */}
          {mode === "international" && parseFloat(taxConfig.rate) > 0 && (
            <div className="flex justify-between text-amber-500">
              <span>{taxConfig.name || "Tax"} ({taxConfig.rate}%)</span>
              <span className="font-medium">{sym}{fmt(totalTax)}</span>
            </div>
          )}
          {mode === "international" && parseFloat(taxConfig.rate) === 0 && (
            <div className="flex justify-between text-neutral-600">
              <span>{taxConfig.name || "Tax"}</span><span>Exempt / 0%</span>
            </div>
          )}

          <div className="flex justify-between pt-2 border-t border-neutral-800 text-neutral-200 font-medium text-sm">
            <span>Total</span>
            <span>{sym}{fmt(Total)}</span>
          </div>
        </div>
      </div>

    </div>
  );
}