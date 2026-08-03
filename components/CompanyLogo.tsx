"use client";

import { useState } from "react";

export function CompanyLogo({ id }: { id: string }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <div className="grid h-[74px] w-[74px] overflow-hidden rounded-2xl bg-white">
        {/* Prefer real logo files from /public/companies when available. */}
        <img
          src={`/companies/${id}.png`}
          alt={id}
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  if (id === "line-man-wongnai") {
    return (
      <div className="grid h-[74px] w-[74px] grid-cols-2 gap-[5px] rounded-2xl bg-white p-3">
        <span className="grid place-items-center rounded-[10px] bg-[#10c95d] text-lg font-bold text-white">M</span>
        <span className="relative grid place-items-center rounded-[10px] bg-[#0d74a5] before:grid before:h-6 before:w-6 before:place-items-center before:rounded-full before:border-2 before:border-white before:bg-[#ff7a29] before:text-[0.92rem] before:font-bold before:text-white before:content-['W']" />
      </div>
    );
  }

  if (id === "agoda") {
    return (
      <div className="relative grid h-[74px] w-[74px] place-items-center rounded-2xl bg-white">
        <span className="absolute top-4 text-base font-medium text-[#666]">agoda</span>
        <span className="absolute bottom-4 flex gap-[5px]">
          {["#ff2f3f", "#ffb51a", "#12b255", "#aa39b9", "#1ba3dc"].map((color) => (
            <span key={color} className="h-[9px] w-[9px] rounded-full" style={{ backgroundColor: color }} />
          ))}
        </span>
      </div>
    );
  }

  if (id === "scb-techx") {
    return (
      <div className="grid h-[74px] w-[74px] place-items-center rounded-2xl bg-[#2f2b2f]">
        <span className="relative h-10 w-10">
          <span className="absolute left-0 top-1 h-3 w-6 -rotate-45 rounded-full bg-[#08c4ff]" />
          <span className="absolute right-0 top-1 h-3 w-6 rotate-45 rounded-full bg-[#ffb23a]" />
          <span className="absolute bottom-1 left-0 h-3 w-6 rotate-45 rounded-full bg-[#8b55ff]" />
          <span className="absolute bottom-1 right-0 h-3 w-6 -rotate-45 rounded-full bg-[#ff4d71]" />
        </span>
      </div>
    );
  }

  return (
    <div className="grid h-[74px] w-[74px] place-items-center rounded-2xl bg-white text-center">
      <span className="px-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#57534e]">
        {id
          .split("-")
          .map((part) => part[0])
          .join("")
          .slice(0, 3)}
      </span>
    </div>
  );
}
