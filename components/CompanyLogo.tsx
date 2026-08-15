"use client";

import { useEffect, useRef, useState } from "react";
import { apiOrigin } from "@/lib/api/client";

function resolveLogoSrc(logoUrl: string | null | undefined) {
  if (!logoUrl) return "/unknown.png";
  if (logoUrl.startsWith("http://") || logoUrl.startsWith("https://")) return logoUrl;
  return `${apiOrigin()}${logoUrl}`;
}

export function CompanyLogo({
  logoUrl,
  alt = "",
  size = 74,
}: {
  logoUrl?: string | null;
  alt?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const box = { width: size, height: size, borderRadius: Math.round(size * 0.22) };

  useEffect(() => {
    setFailed(false);
  }, [logoUrl]);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, [logoUrl]);

  return (
    <div className="grid overflow-hidden bg-white" style={box}>
      <img
        ref={imgRef}
        src={failed ? "/unknown.png" : resolveLogoSrc(logoUrl)}
        alt={alt}
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
