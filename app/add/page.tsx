"use client";

import Link from "next/link";   // ←追加！
import { useState, useEffect } from "react";

export default function AddMedicinePage() {
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [times, setTimes] = useState<string[]>([]);
  const [medList, setMedList] = useState<
    { name: string; times: string[] }[]
  >([]);

  const allTimes = ["朝", "昼", "夕", "寝る前"];

  // 保存データ読み込み
  useEffect(() => {
    const saved = localStorage.getItem("medList");
    if (saved) {
      setMedList(JSON.parse(saved));
    }
  }, []);

  // medList の更新を保存
  useEffect(() => {
    localStorage.setItem("medList", JSON.stringify(medList));
  }, [medList]);

  const toggleTime = (t: string) => {
    let newTimes: string[] = [];

    if (times.includes(t)) {
      newTimes = times.filter((x) => x !== t);
    } else {
      newTimes = [...times, t];
    }

    newTimes.sort((a, b) => {
      return allTimes.indexOf(a) - allTimes.indexOf(b);
    });

    setTimes(newTimes);
  };

  const addMed = () => {
    if (!name) return alert("薬の名前を入力してください");
    if (times.length !== count)
      return alert("回数とタイミング数が一致していません");

    const newMed = { name, times };
    setMedList([...medList, newMed]);

    setName("");
    setCount(1);
    setTimes([]);
  };

  const deleteMed = (index: number) => {
    setMedList(medList.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      {/* ▼ ホームへ戻るリンク追加 ▼ */}
      <Link href="/fukuyaku" className="inline-block mb-4 text-blue-600 underline">
        ← 服薬アプリホームに戻る
      </Link>

      <h1 className="text-2xl font-bold mb-4">薬を登録</h1>

      <div className="space-y-4">
        {/* 薬の名前 */}
        <div>
          <label className="block mb-2 font-semibold">薬の名前</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="例：アセトアミノフェン"
          />
        </div>

        {/* 回数 */}
        <div>
          <label className="block mb-2 font-semibold">1日の服用回数</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="border p-2 rounded w-full"
          >
            <option value={1}>1 回</option>
            <option value={2}>2 回</option>
            <option value={3}>3 回</option>
            <option value={4}>4 回</option>
          </select>
        </div>

        {/* タイミング */}
        <div>
          <label className="block mb-2 font-semibold">飲むタイミング</label>
          <div className="grid grid-cols-2 gap-2">
            {allTimes.map((t) => (
              <button
                key={t}
                onClick={() => toggleTime(t)}
                className={`p-2 rounded border ${
                  times.includes(t)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <p className="text-sm mt-1 text-gray-600">
            ※ {count} 回分ちょうど選んでください
          </p>
        </div>

        <button
          onClick={addMed}
          className="bg-green-600 text-white p-3 rounded w-full"
        >
          登録
        </button>
      </div>

      {/* 登録済み一覧 */}
      <h2 className="text-xl font-bold mt-10 mb-4">登録された薬</h2>

      <div className="space-y-3">
        {medList.map((m, i) => (
          <div
            key={i}
            className="p-3 border rounded bg-gray-50 flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{m.name}</p>
              <p className="text-sm text-gray-700">{m.times.join(" / ")}</p>
            </div>

            <button
              onClick={() => deleteMed(i)}
              className="text-red-600 font-bold"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
