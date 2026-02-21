"use client";

import { useEffect, useRef } from "react";

type AdFormat = "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";

interface AdBannerProps {
  slot: string;
  format?: AdFormat;
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

export default function AdBanner({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className={`ad-container overflow-hidden text-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1140361060649944"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        ref={adRef}
      />
    </div>
  );
}
