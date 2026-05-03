"use client";

import { useState } from "react";

type Dates = {
  next: Date;
  from: Date;
  to: Date;
};

// 1. データの定義はコンポーネントの外に出すのが安全です
const PHARMACY_PRESETS: Record<string, { name: string; address: string; tel: string; fax: string }> = {
  "1": {
    name: "元町グリーン薬局",
    address: "札幌市東区北24条東21丁目1-1",
    tel: "011-784-2480",
    fax: "011-788-7748"
  },
  "2": {
    name: "別の薬局名",
    address: "別の住所...",
    tel: "000-000-0000",
    fax: "000-000-0000"
  }
};

export default function RefillGuidePage() {
  const today = new Date().toISOString().split("T")[0];

  // 2. 状態管理（useState）をまとめました
  const [patientName, setPatientName] = useState("");
  const [dispenseDate, setDispenseDate] = useState(today);
  const [days, setDays] = useState("30");
  const [pharmacyName, setPharmacyName] = useState(""); 
  const [address, setAddress] = useState("");           
  const [tel, setTel] = useState("");                   
  const [fax, setFax] = useState("");                   

  const calcDates = (): Dates | null => {
    if (!dispenseDate || !days) return null;
    const base = new Date(dispenseDate);
    const next = new Date(base);
    next.setDate(next.getDate() + Number(days));
    const from = new Date(next);
    from.setDate(from.getDate() - 7);
    const to = new Date(next);
    to.setDate(to.getDate() + 7);
    return { next, from, to };
  };

  const jp = (dateObj: Date | null) => {
    if (!dateObj) return "";
    return `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
  };

  const result = calcDates();

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
      <div className="no-print">
        <h1>リフィル処方せん受付案内作成</h1>
        <div className="row">
          患者名：
          <input value={patientName} onChange={(e) => setPatientName(e.target.value)} />
        </div>
        <div className="row">
          調剤日：
          <input type="date" value={dispenseDate} onChange={(e) => setDispenseDate(e.target.value)} />
        </div>
        <div className="row">
          処方日数：
          <input value={days} onChange={(e) => setDays(e.target.value)} style={{ width: "90px" }} />日
        </div>
        
        <h3>薬局情報</h3>
        <div className="row">
          薬局名：
          <input 
            value={pharmacyName} 
            placeholder="〇〇薬局"
            onChange={(e) => {
              const val = e.target.value;
              if (PHARMACY_PRESETS[val]) {
                setPharmacyName(PHARMACY_PRESETS[val].name);
                setAddress(PHARMACY_PRESETS[val].address);
                setTel(PHARMACY_PRESETS[val].tel);
                setFax(PHARMACY_PRESETS[val].fax);
              } else {
                setPharmacyName(val);
              }
            }} 
          />
        </div>
        <div className="row">
          住所：
          <input value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: "500px" }} />
        </div>
        <div className="row">
          TEL：
          <input value={tel} onChange={(e) => setTel(e.target.value)} />
        </div>
        <div className="row">
          FAX：
          <input value={fax} onChange={(e) => setFax(e.target.value)} />
        </div>

        <button className="btn" onClick={() => window.print()}>
          印刷
        </button>
      </div>

      <div className="print-area">
        <h2 className="main-title">リフィル処方せんの受付について</h2>

        <h3>ご利用の流れ</h3>
        <div className="flow-box">
          <div className="flow-section">
            <div className="step-label">●1回目</div>
            <div className="flow-steps">
              <div className="flow-step">医療機関受診</div>
              <div className="flow-step">薬の説明・受け取り</div>
              <div className="flow-step">ご帰宅</div>
            </div>
            <div className="flow-images">
              {/* 画像パスは環境に合わせて調整してください */}
              <img src="/images/flow/flow1.png" alt="診察" />
              <img src="/images/flow/flow2.png" alt="調剤" />
              <img src="/images/flow/flow3.png" alt="帰宅" />
            </div>
          </div>

          <div className="important-storage-msg">
            リフィル処方せんはお手元で大切に保管してください
          </div>

          <div className="flow-section">
            <div className="step-label">●2回目以降</div>
            <div className="flow-steps">
              <div className="flow-step">
                リフィル処方せんを<br />有効期間内に薬局に持参
              </div>
              <div className="flow-step">薬の説明・受け取り</div>
              <div className="flow-step">ご帰宅 </div>
            </div>
          </div>
        </div>

        <div className="refill-notice">
          ●リフィル回数・期間終了後は、1回目同様に医療機関受診
        </div>

                <h3>ご注意</h3>
        <ul className="warning-list">
          <li>※お薬の継続的なサポートのため、可能な限り同じ薬局をご利用ください。</li>
          <li>※体調変化等により、医師の診察が必要となる場合があります。</li>
          <li>※アプリ等で処方せんを送信した場合でも、必ず処方せん原本をお持ちください。</li>
        </ul>

        <div className="period-box">
          <div className="patient-row">
            <div className="patient-name">{patientName || "　　　　　　"} 様</div>
            <div className="next-date">次回調剤予定日：{result ? jp(result.next) : ""}</div>
          </div>

          <div className="period-title">次回の処方せん有効期間は</div>

          <div className="big-date">
            <span className="date">
              {result ? jp(result.from) : ""} ～ {result ? jp(result.to) : ""}
            </span>
            <span className="period-note">です。</span>
          </div>

          <div className="carry-area">
            <div className="carry-text">2回目以降も下記をお持ちください。</div>
            <ul className="carry-list">
              <li>リフィル処方せん</li>
              <li>資格確認書、マイナンバーカード</li>
            </ul>
            <div className="return-text">※本日、リフィル処方せんを返却いたしました。</div>
          </div>
        </div>

        <div className="footer-box">
          <div className="footer-left">{pharmacyName}</div>
          <div className="footer-right">
            <div>所在地：{address}</div>
            <div>TEL：{tel}</div>
            <div>FAX：{fax}</div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .print-area { font-family: sans-serif; color: #333; }
        .main-title { text-align: center; font-size: 28px; background: #166534; color: #fff; padding: 10px; border-radius: 10px; margin-bottom: 15px; }
        .flow-section { margin-bottom: 10px; }
        .step-label { font-weight: bold; margin-bottom: 8px; color: #166534; }
        .flow-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .flow-step { background: #e6f4f1; border: 2px solid #2f8f76; border-radius: 12px; padding: 15px 10px; text-align: center; font-weight: bold; display: flex; align-items: center; justify-content: center; position: relative; min-height: 60px; font-size: 17px; }
        .flow-step:not(:last-child)::after { content: "➡"; position: absolute; right: -22px; font-size: 18px; color: #2f8f76; }
        .flow-images { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 10px; }
        .flow-images img { margin: 0 auto; width: 80px; height: 60px; object-fit: contain; }
        .important-storage-msg { color: #166534; font-weight: bold; font-size: 20px; text-align: center; margin: 15px 0; }
        .refill-notice { color: #166534; font-weight: bold; font-size: 18px; margin: 20px 0 10px 0; }
        .period-box { border: 4px solid #0f766e; padding: 25px; margin: 10px 0; border-radius: 12px; }
        .patient-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 15px; }
        .patient-name { font-size: 24px; font-weight: bold; border-bottom: 2px solid #166534; padding-bottom: 4px; }
        .next-date { font-size: 18px; }
        .period-title { text-align: center; font-size: 18px; margin-bottom: 10px; }
        .big-date { text-align: center; margin: 20px 0; }
        .date { font-size: 34px; font-weight: bold; color: #166534; border-bottom: 3px solid #166534; }
        .period-note { font-size: 18px; margin-left: 8px; }
        .carry-area { text-align: left; background: #f0fdf4; padding: 15px; border-radius: 8px; }
        .carry-text { font-weight: bold; margin-bottom: 5px; }
        .carry-list { margin: 0; padding-left: 20px; list-style: disc; }
        .return-text { margin-top: 10px; font-size: 15px; }
        .warning-list { font-size: 14px; line-height: 1.6; margin-bottom: 20px; color: #444; }
        .footer-box { display: grid; grid-template-columns: 100px auto 50px auto 1fr; align-items: center; padding: 15px 0; background: #166534; color: #fff; border-radius: 10px; }
        .footer-left { grid-column: 2; font-size: 22px; font-weight: bold; white-space: nowrap; }
        .footer-right { grid-column: 4; font-size: 14px; line-height: 1.4; white-space: nowrap; }
        .row { margin: 10px 0; }
        input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
        .btn { padding: 10px 20px; background: #166534; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .no-print { margin-bottom: 40px; }
        @media print {
          .no-print { display: none; }
          body { zoom: 1.0; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}