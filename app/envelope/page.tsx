"use client";

import { useRef, useState } from "react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [printAlign, setPrintAlign] = useState("left");

  return (
    <div style={{ padding: "20px" }}>
      <div className="no-print">
        <h1>封筒印刷（完成版）</h1>

        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleCSV}
          style={{ display: "none" }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn"
        >
          CSVファイルを選択
        </button>

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

        <div style={{ marginTop: "10px" }}>
  印刷位置：
  <select
    value={printAlign}
    onChange={(e) => setPrintAlign(e.target.value)}
    style={{ marginLeft: "10px", padding: "5px" }}
  >
    <option value="left">左寄せ（通常）</option>
    <option value="center">中央寄せ</option>
  </select>
</div>

        <button onClick={handlePrint} className="btn print">
          印刷する
        </button>
      </div>

      {selected && (
        <div className={`envelope ${printAlign}`}>
          {selected.postal
            .replace("-", "")
            .split("")
            .map((num, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  top: "16mm",
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

          {/* 会社（←ここ修正ポイント） */}
          <div className="company">
            <span
              dangerouslySetInnerHTML={{
                __html: formatAddress(selected.company),
              }}
            />
          </div>

          <div className="name">
            {selected.name} {title}
          </div>
        </div>
      )}

      <style jsx global>{`
        .btn {
          display: inline-block;
          padding: 10px 18px;
          margin-top: 15px;
          border: none;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          font-size: 14px;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn:hover {
          background: #1e40af;
        }

        .btn.print {
          background: #16a34a;
          margin-left: 10px;
        }

        .btn.print:hover {
          background: #166534;
        }

        .envelope {
          width: 120mm;
          height: 235mm;
          border: 1px solid black;
          position: relative;
          margin-top: 20px;
          background: white;
        }

        /* ←ここに追加 */
.envelope.center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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
    position: absolute;
    top: 0;
  }

  /* 左寄せ（今まで通り） */
  .envelope.left {
    transform: translate(-3mm, -8mm);
  }

  /* 中央寄せ */
  .envelope.center {
    left: 50%;
    transform: translate(-50%, -8mm);
  }

}

        }
      `}</style>
    </div>
  );
}