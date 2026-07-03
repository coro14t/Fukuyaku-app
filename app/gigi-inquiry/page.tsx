"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GigiInquiryRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (window.innerWidth <= 768) {
      router.replace("/gigi-inquiry-mobile");
    } else {
      router.replace("/gigi-inquiry-pc");
    }
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      読み込み中...
    </div>
  );
}