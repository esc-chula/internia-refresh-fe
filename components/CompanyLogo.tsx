"use client";

import { useEffect, useRef, useState } from "react";

export function CompanyLogo({ id, size = 74 }: { id: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const box = { width: size, height: size, borderRadius: Math.round(size * 0.22) };

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, [id]);

  return (
    <div className="grid overflow-hidden bg-white" style={box}>
      <img
        ref={imgRef}
        src={failed ? "/unknown.png" : `/companies/${id}.png`}
        alt={id}
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
