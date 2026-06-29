"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";

export default function GigiInquiryPage() {
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");

  const [gigiType, setGigiType] = useState("残薬調整");

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
            <option>一包化</option>
            <option>規格変更</option>
            <option>用法変更</option>
            <option>用量変更</option>
            <option>日数変更</option>
            <option>粉砕</option>
            <option>後発品変更</option>
            <option>その他</option>
          </select>
        </div>

        <div className="row">疑義照会内容</div>

        <textarea
          value={inquiryText}
          onChange={(e) => setInquiryText(e.target.value)}
          style={{ width: "100%", height: "100px" }}
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
  type="button"
  onClick={() => console.log(croppedAreaPixels)}
>
  切り抜き座標確認
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

        <h2 style={{ textAlign: "center" }}>
          疑義照会変更票
        </h2>

        <table className="form-table">
          <tbody>

            <tr>
              <td style={{ width: "35%" }}>
                {new Date().getFullYear()}年
                {new Date().getMonth() + 1}月
                {new Date().getDate()}日
              </td>

              <td rowSpan={2} style={{ width: "8%", textAlign: "center" }}>
                診療<br />
                科目
              </td>

              <td rowSpan={2} style={{ width: "32%" }}>
                {department}
              </td>

              <td rowSpan={2} style={{ width: "8%", textAlign: "center" }}>
                院外<br />
                No.
              </td>

              <td rowSpan={2} style={{ width: "8%", textAlign: "center" }}>
                4
              </td>
            </tr>

            <tr>
              <td>
                （時刻　{hour}：{minute} 頃）
              </td>
            </tr>

            <tr>
              <td style={{ width: "15%" }}>
                処方医師氏名
              </td>

              <td colSpan={4}>
                {doctor}
              </td>
            </tr>

            <tr>
  <td>ID</td>
  <td>{patientId}</td>
  <td>患者氏名</td>
  <td colSpan={2}>{patientName}</td>
</tr>

            <tr>
              <td colSpan={5}>
                疑義照会内容
                <br />
                {inquiryText}
              </td>
            </tr>

            <tr>
              <td colSpan={2}>変更前処方</td>
              <td colSpan={3}>変更後処方</td>
            </tr>

            <tr style={{ height: "250px" }}>
              
  <td colSpan={2}>
  {croppedImage ? (
  <img
    src={croppedImage}
    alt=""
    style={{
      maxWidth: "100%",
      maxHeight: "220px",
    }}
  />
) : beforeImage ? (
  <img
    src={beforeImage}
    alt=""
    style={{
      maxWidth: "100%",
      maxHeight: "220px",
    }}
  />
) : (
  beforeText
)}
</td>

              <td colSpan={3}>{afterText}</td>
            </tr>

            <tr>
              <td>備考</td>
              <td colSpan={4}>{note}</td>
            </tr>

            <tr>
  <td>薬局名</td>
  <td colSpan={2}>{pharmacyName}</td>
  <td>薬剤師名</td>
  <td>{pharmacist}</td>
</tr>

          </tbody>
        </table>

        <table className="stamp-table">
          <tbody>
            <tr style={{ height: "90px" }}>
              <td className="stamp-label">
                薬剤部<br />
                検認
              </td>
              <td className="stamp-space"></td>

              <td className="stamp-label">
                医事<br />
                入力
              </td>
              <td className="stamp-space"></td>

              <td className="stamp-label">
                医事<br />
                検収
              </td>
              <td className="stamp-space"></td>
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
          padding: 8px;
          vertical-align: top;
        }

        @media print {
          .no-print {
            display: none;
          }

          .print-area {
            border: none;
            margin: 0;
          }
        }

        .stamp-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: -1px;
}

.stamp-table td {
  border: 1px solid black;
}

.stamp-label {
  width: 65px;
  text-align: center;
  vertical-align: top;
  font-weight: bold;
  border-right: 3px solid black !important;
}

.stamp-space {
  width: calc(33.3% - 65px);
}

      `}</style>
    </div>
  );
}