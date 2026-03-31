"use client";

import { useState } from "react";

export default function EnvelopePage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [postal, setPostal] = useState("");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>封筒印刷アプリ</h1>

      {/* 入力フォーム */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", marginBottom: "10px", padding: "8px", width: "300px" }}
        />
        <input
          placeholder="郵便番号"
          value={postal}
          onChange={(e) => setPostal(e.target.value)}
          style={{ display: "block", marginBottom: "10px", padding: "8px", width: "300px" }}
        />
        <input
          placeholder="住所"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ display: "block", marginBottom: "10px", padding: "8px", width: "300px" }}
        />

        <button onClick={handlePrint} style={{ padding: "10px 20px" }}>
          印刷
        </button>
      </div>

      {/* プレビュー */}
      <div
        style={{
          width: "600px",
          height: "300px",
          border: "1px solid black",
          padding: "20px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: "40px", left: "40px" }}>
          〒{postal}
        </div>

        <div style={{ position: "absolute", top: "100px", left: "40px" }}>
          {address}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            fontSize: "24px",
          }}
        >
          {name} 様
        </div>
      </div>
    </div>
  );
}