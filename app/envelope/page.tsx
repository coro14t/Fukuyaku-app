"use client";

import { useState } from "react";

type Person = {
  name: string;
  postal: string;
  address: string;
  company: string;
  memo: string;
};

export default function EnvelopePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [selected, setSelected] = useState<Person | null>(null);
  const [title, setTitle] = useState("様");

  // 縦中横＋縦ハイフン
  const formatAddress = (text: string) => {
    if (!text) return "";

    return text
      .replace(/(\d{2})/g, '<span class="tcy">$1</span>')
      .replace(/-/g, "︱");
  };

  const parseCSV = (text: string) => {
    const rows = text.split("\n").slice(1);

    const data = rows
      .map((row) => {
        const [name, postal, address, company, memo] = row.split(",");
        if (!name) return null;

        return {
          name: name.trim(),
          postal: postal?.trim() || "",
          address: address?.trim() || "",
          company: company?.trim() || "",
          memo: memo?.trim() || "",
        };
      })
      .filter(Boolean) as Person[];

    setPeople(data);
  };

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;

      if (text.includes("�")) {
        const reader2 = new FileReader();
        reader2.onload = (e2) => {
          parseCSV(e2.target?.result as string);
        };
        reader2.readAsText(file, "Shift-JIS");
      } else {
        parseCSV(text);
      }
    };

    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
  };

  const positions = [53, 46, 39, 32, 25, 18, 11];

  return (
    <div style={{ padding: "20px" }}>
      {/* UI */}
      <div className="no-print">
        <h1>封筒印刷（完成版）</h1>

        <input type="file" accept=".csv" onChange={handleCSV} />

        <div style={{ marginTop: "20px" }}>
          {people.map((p, i) => (
            <div
              key={i}
              onClick={() => setSelected(p)}
              style={{
                cursor: "pointer",
                padding: "6px",
                borderBottom: "1px solid #ccc",
              }}
            >
              {p.name}（{p.company}）
              {p.memo && (
                <span style={{ color: "red", marginLeft: "10px" }}>
                  [{p.memo}]
                </span>
              )}
            </div>
          ))}
        </div>

        <select
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginTop: "10px", padding: "5px" }}
        >
          <option value="様">様</option>
          <option value="御中">御中</option>
          <option value="先生">先生</option>
        </select>

        <button onClick={handlePrint} style={{ marginTop: "20px" }}>
          印刷
        </button>
      </div>

      {/* 封筒 */}
      {selected && (
        <div className="envelope">
          {/* 郵便番号 */}
          {selected.postal
            .replace("-", "")
            .split("")
            .map((num, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  top: "12mm",
                  right: `${positions[i]}mm`,
                  width: "6mm",
                  textAlign: "center",
                  fontSize: "14pt",
                }}
              >
                {num}
              </span>
            ))}

          {/* 住所 */}
          <div className="address">
            <span
              dangerouslySetInnerHTML={{
                __html: formatAddress(selected.address),
              }}
            />
          </div>

          {/* 会社 */}
          <div className="company">{selected.company}</div>

          {/* 名前 */}
          <div className="name">
            {selected.name} {title}
          </div>
        </div>
      )}

      <style jsx global>{`
        .envelope {
          width: 120mm;
          height: 235mm;
          border: 1px solid black;
          position: relative;
          margin-top: 20px;
          background: white;
        }

        .address {
          position: absolute;
          top: 35mm;
          right: 15mm;
          writing-mode: vertical-rl;
          text-orientation: upright;
          font-size: 14pt;
          line-height: 1.8;
        }

        .company {
          position: absolute;
          top: 35mm;
          right: 30mm;
          writing-mode: vertical-rl;
          text-orientation: upright;
          font-size: 14pt;
          line-height: 1.8;
        }

        .name {
          position: absolute;
          top: 80mm;
          right: 50%;
          transform: translateX(50%);
          writing-mode: vertical-rl;
          text-orientation: upright;
          font-size: 22pt;
          font-weight: bold;
          line-height: 2;
        }

        .tcy {
          writing-mode: horizontal-tb;
          display: inline-block;
          text-orientation: mixed;
          font-size: 0.9em;
        }

        @media print {
          .no-print {
            display: none;
          }

          .envelope {
            border: none;
            transform: translate(-3mm, -8mm);
          }
        }
      `}</style>
    </div>
  );
}