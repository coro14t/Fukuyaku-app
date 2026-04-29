"use client";

import { useState } from "react";

export default function HomecareDocsPage(){

const today=
new Date().toISOString().split("T")[0];

const [documentType,setDocumentType]=
useState("医療保険");

const [docMode,setDocMode]=
useState("指示依頼書");

const [sendType,setSendType]=
useState("郵送");

const [createdDate,setCreatedDate]=
useState(today);

/* 宛先 */
const [recipient,setRecipient]=useState("");
const [personName,setPersonName]=useState("");
const [honorific,setHonorific]=useState("先生");

/* 薬局 */
const [pharmacyName,setPharmacyName]=useState("");
const [pharmacyAddress,setPharmacyAddress]=useState("");
const [pharmacyTel,setPharmacyTel]=useState("");
const [pharmacyStaff,setPharmacyStaff]=useState("");

/* 患者情報 */
const [patientName,setPatientName]=useState("");
const [patientSex,setPatientSex]=useState("男");
const [birthEra,setBirthEra]=useState("昭和");
const [birthYear,setBirthYear]=useState("");
const [birthMonth,setBirthMonth]=useState("");
const [birthDay,setBirthDay]=useState("");
const [patientAddress,setPatientAddress]=useState("");
const convertWarekiToDate=()=>{
if(
!birthYear ||
!birthMonth ||
!birthDay
) return "";

let westernYear=0;

if(birthEra==="大正"){
westernYear=1911+Number(birthYear);
}

if(birthEra==="昭和"){
westernYear=1925+Number(birthYear);
}

if(birthEra==="平成"){
westernYear=1988+Number(birthYear);
}

if(birthEra==="令和"){
westernYear=2018+Number(birthYear);
}

const mm=String(birthMonth).padStart(2,"0");
const dd=String(birthDay).padStart(2,"0");

return `${westernYear}-${mm}-${dd}`;
};

const calcAge=(birth:string,baseDate:string)=>{
if(!birth || !baseDate) return "";

const base = new Date(baseDate);
const b = new Date(birth);

let age=
base.getFullYear()-b.getFullYear();

if(
base.getMonth() < b.getMonth() ||
(
base.getMonth()===b.getMonth() &&
base.getDate() < b.getDate()
)
){
age--;
}

return String(age);
};

const [careInsurance,setCareInsurance]=useState("なし");
const [careLevel,setCareLevel]=useState("要介護1");

const [careManager,setCareManager]=useState("");
const [careManagerTel,setCareManagerTel]=useState("");

const [patientInfo,setPatientInfo]=useState("");
const [focusRequest,setFocusRequest]=useState("");
const [department,setDepartment]=useState("");
const [doctor,setDoctor]=useState("");
const [lastVisit,setLastVisit]=useState("");
const [nextVisit,setNextVisit]=useState("");
const [note,setNote]=useState("");
const [sendPages,setSendPages]=useState("5");
const [messageMode,setMessageMode]=useState("定型文");
const defaultCoverText = `拝啓、時下ますますご清栄のこととお喜び申し上げます。

下記書類を送付致しますので、ご確認よろしくお願いいたします。

記

送付書類
・薬学的管理指導計画書
・居宅療養管理指導報告書

ご不明な点などございましたら、お知らせください。
今後ともよろしくお願いいたします。

以上`;

const [freeMessage,setFreeMessage]=useState(defaultCoverText);
const [sendDocs,setSendDocs]=useState(`薬学的管理指導計画書
居宅療養管理指導報告書`);
const formatJapaneseDate=(dateStr:string)=>{
if(!dateStr) return "____年__月__日";
const d=new Date(dateStr);
return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
};

const getTitle=(type:string)=>{
return type==="介護保険"
? "居宅療養管理指導指示書"
: "在宅患者訪問薬剤管理指導指示書";
};

const box=(v:boolean)=>
v?"■":"□";

return(

<div style={{
padding:"20px",
maxWidth:"1100px",
margin:"0 auto"
}}>

<div className="no-print">

<h1>在宅書類作成ツール</h1>

<div className="row">
文書種類：
<select
value={docMode}
onChange={(e)=>setDocMode(e.target.value)}
>
<option>指示依頼書</option>
<option>送付状</option>
</select>
</div>

{docMode==="指示依頼書" && (
<div className="row">
保険種別：
<select
value={documentType}
onChange={(e)=>setDocumentType(e.target.value)}
>
<option value="医療保険">医療保険</option>
<option value="介護保険">介護保険</option>
</select>
</div>
)}

{docMode==="送付状" && (
<div className="row">
送付方法：
<select
value={sendType}
onChange={(e)=>setSendType(e.target.value)}
>
<option>郵送</option>
<option>FAX</option>
</select>
</div>
)}

<div className="row">
病院・施設名：
<input
value={recipient}
onChange={(e)=>setRecipient(e.target.value)}
placeholder="〇〇クリニック"
/>
</div>

<div className="row">
担当者名：
<input
value={personName}
onChange={(e)=>setPersonName(e.target.value)}
placeholder="△△先生"
/>

<select
value={honorific}
onChange={(e)=>setHonorific(e.target.value)}
>
<option>先生</option>
<option>様</option>
<option>御中</option>
</select>
</div>

<div className="row">
作成日：
<input
type="date"
value={createdDate}
onChange={(e)=>setCreatedDate(e.target.value)}
/>
</div>

<h3>保険薬局情報</h3>

<div className="row">
薬局名：
<input
value={pharmacyName}
onChange={(e)=>setPharmacyName(e.target.value)}
/>
</div>

<div className="row">
所在地：
<input
value={pharmacyAddress}
onChange={(e)=>setPharmacyAddress(e.target.value)}
style={{width:"420px"}}
/>
</div>

<div className="row">
連絡先：
<input
value={pharmacyTel}
onChange={(e)=>setPharmacyTel(e.target.value)}
/>
</div>

<div className="row">
担当者氏名：
<input
value={pharmacyStaff}
onChange={(e)=>setPharmacyStaff(e.target.value)}
/>
</div>

{docMode==="指示依頼書" && (
<>
<h3>患者情報</h3>

<div className="row">
患者氏名：
<input
value={patientName}
onChange={(e)=>setPatientName(e.target.value)}
/>

性別：
<select
value={patientSex}
onChange={(e)=>setPatientSex(e.target.value)}
>
<option>男</option>
<option>女</option>
</select>
</div>

<div className="row">
生年月日：
<select
value={birthEra}
onChange={(e)=>setBirthEra(e.target.value)}
>
<option>大正</option>
<option>昭和</option>
<option>平成</option>
<option>令和</option>
</select>

<input
value={birthYear}
onChange={(e)=>setBirthYear(e.target.value)}
style={{width:"70px"}}
/>
年

<input
value={birthMonth}
onChange={(e)=>setBirthMonth(e.target.value)}
style={{width:"55px"}}
/>
月

<input
value={birthDay}
onChange={(e)=>setBirthDay(e.target.value)}
style={{width:"55px"}}
/>
日

年齢：
<input
value={calcAge(convertWarekiToDate(),createdDate)}
readOnly
style={{
width:"80px",
background:"#e2e8f0"
}}
/>
</div>

<div className="row">
住所：
<input
value={patientAddress}
onChange={(e)=>setPatientAddress(e.target.value)}
style={{width:"520px"}}
/>
</div>

<div className="row">
介護保険：

<select
value={careInsurance}
onChange={(e)=>setCareInsurance(e.target.value)}
>
<option value="なし">なし</option>
<option value="あり">あり</option>
</select>

{careInsurance==="あり"&&(
<select
value={careLevel}
onChange={(e)=>setCareLevel(e.target.value)}
>
<option>要支援1</option>
<option>要支援2</option>
<option>要介護1</option>
<option>要介護2</option>
<option>要介護3</option>
<option>要介護4</option>
<option>要介護5</option>
</select>
)}

</div>

<div className="row">
ケアマネ：
<input
value={careManager}
onChange={(e)=>setCareManager(e.target.value)}
/>

連絡先：
<input
value={careManagerTel}
onChange={(e)=>setCareManagerTel(e.target.value)}
/>
</div>

<div className="row">
患者情報欄
</div>

<textarea
value={patientInfo}
onChange={(e)=>setPatientInfo(e.target.value)}
style={{width:"100%",height:"120px"}}
/>

<div className="row">
重点依頼内容
</div>

<textarea
value={focusRequest}
onChange={(e)=>setFocusRequest(e.target.value)}
style={{width:"100%",height:"100px"}}
/>

<div className="row">
診療科：
<input
value={department}
onChange={(e)=>setDepartment(e.target.value)}
/>

医師：
<input
value={doctor}
onChange={(e)=>setDoctor(e.target.value)}
/>
</div>

<div className="row">
最終受診日：
<input
type="date"
value={lastVisit}
onChange={(e)=>setLastVisit(e.target.value)}
/>

次回予約日：
<input
type="date"
value={nextVisit}
onChange={(e)=>setNextVisit(e.target.value)}
/>
</div>

<div className="row">
備考
</div>

<textarea
value={note}
onChange={(e)=>setNote(e.target.value)}
style={{width:"100%",height:"100px"}}
/>

<br/>

</>
)}

{docMode==="送付状" && (
<>
<div className="row">
送付枚数：
<input
value={sendPages}
onChange={(e)=>setSendPages(e.target.value)}
style={{width:"80px"}}
/>
枚（送付状を含む）
</div>

<div className="row">
本文編集：
</div>

<textarea
value={freeMessage}
onChange={(e)=>setFreeMessage(e.target.value)}
style={{width:"100%",height:"260px"}}
/>
</>
)}

<button
className="btn print"
onClick={()=>window.print()}
>
印刷
</button>

</div>

<div className="print-area">

<h2 className="doc-title">
{docMode==="送付状"
 ? "送付状"
 : getTitle(documentType)}
</h2>

<div className="top-grid">

<div className="left-block">
<div>
{recipient||"________________"}
</div>

<div>
{personName||"________________"} {honorific}
</div>
</div>

<div className="right-block">
<div>作成日　{formatJapaneseDate(createdDate)}</div>
<div>保険薬局名　{pharmacyName||"________"}</div>
<div>所在地　{pharmacyAddress||"________"}</div>
<div>連絡先 Tel/Fax　{pharmacyTel||"________"}</div>
<div>氏名　{pharmacyStaff||"________"}　印</div>
</div>

</div>

{docMode==="指示依頼書" && (
<div className="guide">
　下記の患者様に在宅訪問指導の必要性が認められました。ご自宅を訪問し、服薬状況と薬剤管理状況の確認、服薬指導、副作用の確認、服薬によるADLへの影響、調剤方法の検討、介護者の負担軽減・生活状況の把握等をさせていただきたいと考えておりますので、ご検討ください。
尚、ご本人(家族)には、本サービスの内容および費用につき説明・同意を得ております。
</div>
)}

{docMode==="指示依頼書" && (
<>
<table className="form-table">
<tbody>

<tr>
<td>患者氏名</td>
<td colSpan={2}>
{patientName} 様
</td>
<td>
性別　{patientSex}
</td>
</tr>

<tr>
<td>生年月日</td>
<td colSpan={3}>
{birthEra}{birthYear}年{birthMonth}月{birthDay}日
（ {calcAge(convertWarekiToDate(),createdDate)} 才 ）
</td>
</tr>

<tr>
<td>住所</td>
<td colSpan={3}>
{patientAddress}
</td>
</tr>

<tr>
<td>介護保険</td>
<td colSpan={3}>
{box(careInsurance==="あり")}あり（{careLevel}）
　
{box(careInsurance==="なし")}なし
</td>
</tr>

<tr>
<td>ケアマネージャー</td>
<td>{careManager}</td>
<td>連絡先</td>
<td>{careManagerTel}</td>
</tr>

<tr>
<td colSpan={4}>
患者情報
<br/><br/><br/>
{patientInfo}
</td>
</tr>

<tr>
<td colSpan={4}>
依頼内容
<br/>
　服薬状況と薬剤管理状況の確認、服薬指導、副作用確認、
　薬剤によるADLへの影響
<br/>
　調剤方法検討、介護者負担軽減・生活状況把握
<br/>
上記に加え、重点的に依頼したい内容
<br/>
{focusRequest}
　（　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　）
</td>
</tr>

<tr>
<td>診療科（担当医）</td>
<td>{department}</td>
<td>医師</td>
<td>{doctor}</td>
</tr>

<tr>
<td>最終受診日</td>
<td>{formatJapaneseDate(lastVisit)}</td>
<td>次回予約日</td>
<td>{formatJapaneseDate(nextVisit)}</td>
</tr>

<tr>
<td colSpan={4}>
備考
<br/><br/>
{note}
</td>
</tr>

</tbody>
</table>

<div className="note-text">
※太枠内に記入し、返送をお願いいたします。
</div>

</>
)}

</div>

{docMode==="送付状" && (
<>
<div className="fax-count-box">
送付枚数：{sendPages} 枚（送付状を含む）
</div>

<div className="cover-box">
<pre>
{freeMessage}
</pre>
</div>
</>
)}

<style jsx global>{`

input,select,textarea{
padding:10px 12px;
margin:6px;
border:2px solid #94a3b8;
border-radius:8px;
background:#f8fafc;
font-size:15px;
transition:all .2s;
}

input::placeholder,
textarea::placeholder{
color:#94a3b8;
}

input:hover,
select:hover,
textarea:hover{
border-color:#64748b;
background:#ffffff;
}

input:focus,
select:focus,
textarea:focus{
outline:none;
border-color:#2563eb;
box-shadow:0 0 0 3px rgba(37,99,235,.15);
background:#ffffff;
}

.row{
margin-bottom:14px;
}

.btn{
padding:10px 18px;
border:none;
border-radius:8px;
background:#16a34a;
color:white;
cursor:pointer;
}

.btn:hover{
opacity:.92;
}

.print-area{
margin-top:30px;
padding:40px;
background:white;
border:1px solid #ccc;
}

.doc-title{
text-align:center;
margin-bottom:32px;
font-family:serif;
font-weight:normal;
font-size:26px;
}

.top-grid{
display:flex;
justify-content:space-between;
align-items:flex-start;
margin-bottom:28px;
}

.left-block{
width:58%;
white-space:nowrap;
font-family:serif;
font-size:18px;
}

.right-block{
width:38%;
line-height:1.9;
font-size:16px;
font-family:serif;
}

.guide{
margin-bottom:18px;
line-height:1.8;
font-family:serif;
font-size:15px;
}

.form-table{
width:100%;
border-collapse:collapse;
font-family:serif;
border:3px solid #000;
break-inside:avoid;
page-break-inside:avoid;
}

.form-table td{
border:1px solid #000;
padding:7px;
vertical-align:top;
font-size:15px;
line-height:1.6;
}

.note-text{
margin-top:8px;
font-family:serif;
font-size:12px;
page-break-inside:avoid;
}

.fax-title-box{
border:3px solid #000;
height:60px;
display:flex;
justify-content:center;
align-items:center;
margin-bottom:20px;
}

.fax-title{
font-size:30px;
font-family:serif;
font-weight:bold;
}

.fax-count-box{
border:1px solid #000;
padding:8px 12px;

width:280px;

margin-left:auto;   /* 右寄せ */
margin-right:2.5%;  /* cover-box右端に合わせる */
margin-bottom:20px;

box-sizing:border-box;
}

.fax-header-table{
width:100%;
border-collapse:collapse;
margin-bottom:30px;
}

.fax-header-table th,
.fax-header-table td{
border:1px solid #000;
padding:10px;
}

.cover-box{
border:2px solid #000;
width:95%;
margin:14px auto;
min-height:500px;   /* 指示依頼書に近い高さ */
padding:18px 20px;  /* 左右余白縮小 */
line-height:1.8;
font-family:serif;

page-break-inside:avoid;
break-inside:avoid;
box-sizing:border-box;
}

.cover-box pre{
white-space:pre-wrap;
font-family:serif;
margin:0;
}

@media print{

.no-print{
display:none;
}

input,
select,
textarea{
border:none;
box-shadow:none;
background:white;
}

.print-area{
border:none;
padding:15mm;
margin:0;
}

.form-table{
break-inside:avoid;
page-break-inside:avoid;
}

.note-text{
break-inside:avoid;
page-break-inside:avoid;
}

}

`}</style>

</div>

);

}