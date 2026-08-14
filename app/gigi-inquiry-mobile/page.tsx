"use client";

import { useState, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";

export default function GigiInquiryPage() {
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");

  const [gigiType, setGigiType] = useState("残薬調整");
  const [otherReason, setOtherReason] = useState("");

  const [inquiryText, setInquiryText] = useState("");
  const [beforeText, setBeforeText] = useState("");
  const [afterText, setAfterText] = useState("");
  const [note, setNote] = useState("");

  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacist, setPharmacist] = useState("");

  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);

const [croppedAreaPixels, setCroppedAreaPixels] =
  useState<any>(null);

  const onCropComplete = (
  croppedArea: any,
  croppedAreaPixels: any
) => {
  setCroppedAreaPixels(croppedAreaPixels);
};
const [croppedImage, setCroppedImage] =
  useState<string | null>(null);
const showCropInfo = async () => {
  if (!beforeImage || !croppedAreaPixels) return;



  const cropped = await getCroppedImg(
    beforeImage,
    croppedAreaPixels
  );

  setCroppedImage(cropped);
};
const handleImage = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  setBeforeImage(url);
};

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="no-print">

        <h1>疑義照会変更票作成</h1>

        <div className="row">
          時刻：
          <input
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            style={{ width: "60px" }}
          />
          時

          <input
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            style={{ width: "60px" }}
          />
          分頃
        </div>

        <div className="row">
          診療科：
          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          医師名：
          <input
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
          />
        </div>

        <div className="row">
          患者氏名：
          <input
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />

          ID：
          <input
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
        </div>

        <div className="row">
          疑義区分：
          <select
            value={gigiType}
            onChange={(e) => setGigiType(e.target.value)}
          >
            <option>残薬調整</option>
            <option>一包化指示追加</option>
            <option>規格の変更</option>
            <option>用法の変更</option>
            <option>用量の変更</option>
            <option>日数の変更</option>
            <option>粉砕指示追加</option>
            <option>後発品へ変更</option>
            <option>その他</option>
          </select>
          {gigiType === "その他" && (
  <div className="row">
    内容：
    <input
      value={otherReason}
      onChange={(e) => setOtherReason(e.target.value)}
      style={{ width: "400px" }}
    />
  </div>
)}
        </div>

        <div className="row">疑義照会内容</div>

        <textarea
  value={
    gigiType === "その他"
      ? otherReason
      : gigiType
  }
  readOnly
  style={{ width: "100%", height: "80px" }}
/>

        <div className="row">変更前処方</div>

<div className="row">
  処方箋画像
</div>

<input
  type="file"
  accept="image/*"
  capture="environment"
  onChange={handleImage}
/>

{beforeImage && (
  <div
    style={{
      position: "relative",
      height: "400px",
      marginTop: "10px",
    }}
  >
    <Cropper
      image={beforeImage}
      crop={crop}
      zoom={zoom}
      aspect={4 / 3}
      onCropChange={setCrop}
      onZoomChange={setZoom}
      onCropComplete={onCropComplete}
    />
  </div>
)}

{beforeImage && (
  <input
    type="range"
    min={1}
    max={3}
    step={0.1}
    value={zoom}
    onChange={(e) =>
      setZoom(Number(e.target.value))
    }
  />
)}

<button
　className="btn"
  type="button"
  onClick={showCropInfo}
>
  切り抜き確定
</button>

        <textarea
          value={beforeText}
          onChange={(e) => setBeforeText(e.target.value)}
          style={{ width: "100%", height: "150px" }}
        />

        <div className="row">変更後処方</div>

        <textarea
          value={afterText}
          onChange={(e) => setAfterText(e.target.value)}
          style={{ width: "100%", height: "150px" }}
        />

        <div className="row">備考</div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ width: "100%", height: "80px" }}
        />

        <div className="row">
          薬局名：
          <input
            value={pharmacyName}
            onChange={(e) => setPharmacyName(e.target.value)}
          />

          薬剤師名：
          <input
            value={pharmacist}
            onChange={(e) => setPharmacist(e.target.value)}
          />
        </div>

        <button
          className="btn"
          onClick={() => window.print()}
        >
          印刷
        </button>

      </div>

      <div className="print-area">

        <h2 style={{
    textAlign: "center",
    fontSize: "20px",
    margin: "8px 0",}}>
          疑義照会変更票
        </h2>

        <table className="form-table">

  <colgroup>
  <col style={{ width: "15%" }} />
  <col style={{ width: "25%" }} />
  <col style={{ width: "10%" }} />

  <col style={{ width: "21%" }} />
  <col style={{ width: "12%" }} />
  <col style={{ width: "17%" }} />
</colgroup>

  <tbody>

            <tr>
  <td colSpan={2} className="label-cell">
    {new Date().getFullYear()}年
    {new Date().getMonth() + 1}月
    {new Date().getDate()}日
  </td>

  <td rowSpan={2} style={{ textAlign: "center" }}>
    診　療<br />
    科　目
  </td>

  <td rowSpan={2}>
    {department}
  </td>

  <td rowSpan={2} style={{ textAlign: "center" }}>
    院　外<br />
    　 No.
  </td>

  <td rowSpan={2} style={{ textAlign: "center",fontSize: "22px", }}>
    4
  </td>
</tr>

<tr>
  <td colSpan={2} className="label-cell">
    （時刻　{hour}：{minute}頃）
  </td>
</tr>

<tr>
  <td colSpan={2} className="label-cell">
    処　方　医　師<br />
    氏　　　　　名
  </td>

              <td colSpan={4}>
                {doctor}
              </td>
            </tr>

  <tr>
  <td className="label-cell">ID<br />No.</td>

  <td>
    {patientId}
  </td>

  <td className="label-cell">
    患　者<br />
    氏　名
  </td>

  <td colSpan={3}>
    {patientName}
  </td>
</tr>

            <tr>
              <td colSpan={6} className="label-cell">
                疑義照会内容及び変更・追加内容
                <br />
                {inquiryText}
              </td>
            </tr>

            <tr>
  <td
    colSpan={3}
    style={{
      width: "50%",
      textAlign: "center",
    }}
  >
    変更前の処方内容
  </td>

  <td
    colSpan={3}
    style={{
      width: "50%",
      textAlign: "center",
    }}
  >
    変更後の処方内容
  </td>
</tr>

            <tr style={{ height: "300px" }}>
              
  <td colSpan={3}
  style={{ verticalAlign: "top",whiteSpace: "pre-wrap", }}>
  {croppedImage ? (
    <>
  <img
    src={croppedImage}
    alt=""
    style={{
      maxWidth: "100%",
      maxHeight: "280px",
    }}
  />
  <div style={{ marginTop: "8px" }}>
        {beforeText}
      </div>
    </>
) : beforeImage ? (
  <>
  <img
    src={beforeImage}
    alt=""
    style={{
      maxWidth: "50%",
      maxHeight: "220px",
    }}
  />
  <div style={{ marginTop: "8px" }}>
        {beforeText}
      </div>
    </>
) : (
  beforeText
)}
</td>

              <td colSpan={3}
              style={{ verticalAlign: "top",whiteSpace: "pre-wrap", }}
              >{afterText}</td>
            </tr>

            <tr style={{ height: "60px" }}>
              <td className="label-cell">備考欄</td>
              <td colSpan={5}>{gigiType === "その他"
  ? otherReason
  : gigiType}</td>
            </tr>

           <tr style={{ height: "50px" }}>
  <td className="label-cell">保険薬局名</td>

  <td colSpan={2}>
    {pharmacyName}
  </td>

  <td className="label-cell">
    薬剤師名
  </td>

  <td colSpan={2}>
    {pharmacist}
  </td>
</tr>

<tr style={{ height: "60px" }}>
  <td className="label-cell">薬剤部<br />検認</td>
  <td></td>

  <td className="label-cell">医事<br />入力</td>
  <td></td>

  <td className="label-cell">医事<br />検収</td>
  <td></td>
</tr>

          </tbody>
        </table>

      </div>

      <style jsx global>{`
        .row {
          margin-bottom: 12px;
        }

input,
select,
textarea {
  margin: 6px;
  padding: 8px;
  border: 2px solid #6b7280;   /* 常に濃い枠線 */
  border-radius: 6px;
  background: #ffffff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:hover,
select:hover,
textarea:hover {
  border-color: #374151;        /* マウスを乗せると少し濃く */
}

input:focus,
select:focus,
textarea:focus {
  border-color: #2563eb;        /* 入力中は青 */
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

        .btn {
          padding: 10px 18px;
          border: none;
          background: #16a34a;
          color: white;
          border-radius: 8px;
          cursor: pointer;
        }

        .print-area {
          margin-top: 30px;
          background: white;
          padding: 30px;
          border: 1px solid #ccc;
        }

        .form-table {
          width: 100%;
          border-collapse: collapse;
        }

        .form-table td {
          border: 1px solid black;
          padding: 4px;
          vertical-align: middle;
        }

        .label-cell {
  text-align: center;
  vertical-align: middle;
}

@page {
  size: A4 portrait;
  margin: 5mm;
}

@media print {
  .no-print {
    display: none;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  .print-area {
    width: 100%;
    margin: 0;
    padding: 0;
    border: none;
  }

  .form-table,
   {
    width: 100%;
    table-layout: fixed;
  }
}

.form-table {
  page-break-after: avoid;
  page-break-inside: avoid;
}

.print-area {
  page-break-inside: avoid;
}

.stamp-label {
  width: 65px;
  text-align: center;
  vertical-align: middle;

}

.stamp-space {
  width: calc(33.3% - 65px);
}

.row {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

input,
select,
textarea,
button {
  width: 100%;
  box-sizing: border-box;
  margin: 6px 0;
}

.print-area {
  margin-top: 20px;
  background: white;
  padding: 10px;
  border: 1px solid #ccc;
}

.form-table td {
  font-size: 14px;
}

      `}</style>
    </div>
    );
}