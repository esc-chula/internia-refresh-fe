function Sigma({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 129" fill="none" className={className} aria-hidden="true">
      <path d="M9.43292 90.9577L14.4994 75.9214L52.4714 57.0263L34.1109 6.10352e-05L119.192 29.188C116.499 37.2257 115.158 41.2419 112.465 49.2797L106.686 36.9476L51.5881 18.0457L66.3051 62.8383L9.43292 90.9577Z" fill="currentColor" />
      <path d="M85.2293 128.67L5.96859 101.35L6.76697 99.0231L68.5509 69.5003L72.2216 80.5026L34.482 99.2293L79.6317 114.792L91.9324 109.131L85.2293 128.67Z" fill="currentColor" />
    </svg>
  );
}

function Gear({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 92 95" fill="none" className={className} aria-hidden="true">
      <path d="M61.873 8.1031C61.4644 10.7974 62.9416 13.3884 65.2829 14.7827C67.9326 16.3606 70.3599 18.2465 72.523 20.3843C74.5551 22.3926 77.5453 23.2618 80.2058 22.2207C83.5345 20.9182 87.2888 22.5605 88.5916 25.889L91.2742 32.7428C92.4835 35.8325 90.959 39.3175 87.8692 40.5267C85.2869 41.5372 83.7834 44.1862 83.8121 46.959C83.833 48.9731 83.6934 51.0153 83.3816 53.0711C83.1464 54.622 82.8196 56.1363 82.4083 57.6097C81.7141 60.0965 82.3843 62.8329 84.4013 64.4446C86.9149 66.453 87.3244 70.1188 85.316 72.6323L79.9852 79.3042C78.0981 81.6661 74.6535 82.0508 72.2917 80.1635C70.3263 78.593 67.5634 78.6017 65.4073 79.898C62.1216 81.8737 58.5292 83.3587 54.7438 84.2695C52.0941 84.907 49.9148 86.9436 49.5061 89.6381C49.0065 92.9319 45.9314 95.197 42.6376 94.6974L34.95 93.5314C31.6562 93.0318 29.391 89.9567 29.8906 86.6629C30.2993 83.9684 28.822 81.3771 26.4803 79.9829C23.1155 77.9796 20.109 75.4797 17.5467 72.5982C15.8198 70.6561 13.0977 69.792 10.6777 70.7394C7.78254 71.8729 4.51678 70.4445 3.38366 67.5493L0.419788 59.9764C-0.803767 56.8501 0.738534 53.3238 3.86472 52.1C6.36143 51.1226 7.87265 48.6206 7.977 45.9415C8.03175 44.5358 8.1651 43.1188 8.381 41.6953C8.67359 39.7663 9.10702 37.8935 9.66895 36.0856C10.5213 33.3435 9.84184 30.2664 7.59839 28.474C4.90177 26.3196 4.46231 22.387 6.61684 19.6904L10.9659 14.2473C13.2491 11.3897 17.4165 10.924 20.2742 13.2071C22.5692 15.0406 25.7725 15.0885 28.3777 13.7314C31.0969 12.3149 33.9971 11.2223 37.0201 10.4956C39.6697 9.85861 41.8489 7.82215 42.2575 5.12788C42.7571 1.83441 45.8319 -0.430511 49.1254 0.0690283L56.8141 1.23523C60.1076 1.73477 62.3725 4.80962 61.873 8.1031ZM47.8422 30.5642C38.9207 29.2111 30.5911 35.3467 29.2379 44.2681C27.8847 53.1897 34.0203 61.5192 42.9418 62.8724C51.8634 64.2256 60.1929 58.0901 61.5461 49.1685C62.8992 40.247 56.7637 31.9174 47.8422 30.5642Z" fill="currentColor" />
    </svg>
  );
}

type Piece = {
  icon: "sigma" | "gear";
  top: string;
  left: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  driftR: number;
  hideOnMobile?: boolean;
};

const pieces: Piece[] = [
  { icon: "sigma", top: "12%", left: "6%", size: 46, opacity: 0.55, duration: 10, delay: 0, driftX: 10, driftY: -14, driftR: 8 },
  { icon: "gear", top: "68%", left: "9%", size: 34, opacity: 0.5, duration: 12, delay: 1.2, driftX: -8, driftY: 12, driftR: -10 },
  { icon: "gear", top: "18%", left: "88%", size: 40, opacity: 0.45, duration: 11, delay: 0.6, driftX: -12, driftY: -10, driftR: 10 },
  { icon: "sigma", top: "78%", left: "92%", size: 38, opacity: 0.5, duration: 9.5, delay: 2, driftX: 8, driftY: 10, driftR: -6 },
  { icon: "sigma", top: "45%", left: "50%", size: 30, opacity: 0.35, duration: 13, delay: 1.6, driftX: -10, driftY: 8, driftR: 6, hideOnMobile: true },
  { icon: "gear", top: "8%", left: "42%", size: 26, opacity: 0.4, duration: 10.5, delay: 0.4, driftX: 8, driftY: 10, driftR: -8, hideOnMobile: true },
  { icon: "gear", top: "88%", left: "40%", size: 24, opacity: 0.35, duration: 14, delay: 2.4, driftX: -6, driftY: -8, driftR: 6, hideOnMobile: true },
  { icon: "sigma", top: "30%", left: "22%", size: 22, opacity: 0.3, duration: 12.5, delay: 3, driftX: 6, driftY: -8, driftR: 5, hideOnMobile: true },
];

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((piece, index) => {
        const Icon = piece.icon === "sigma" ? Sigma : Gear;
        return (
          <div
            key={index}
            className={`hero-float absolute text-[#ccd8e1] ${piece.hideOnMobile ? "hidden sm:block" : ""}`}
            style={
              {
                top: piece.top,
                left: piece.left,
                width: piece.size,
                opacity: piece.opacity,
                "--duration": `${piece.duration}s`,
                "--delay": `${piece.delay}s`,
                "--drift-x": `${piece.driftX}px`,
                "--drift-y": `${piece.driftY}px`,
                "--drift-r": `${piece.driftR}deg`,
              } as React.CSSProperties
            }
          >
            <Icon className="h-auto w-full" />
          </div>
        );
      })}
    </div>
  );
}
