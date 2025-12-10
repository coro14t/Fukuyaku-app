"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckPage() {
  const [medList, setMedList] = useState<
    { name: string; times: string[] }[]
  >([]);

  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [score, setScore] = useState(0);        // 累計スコア
  const [todayScore, setTodayScore] = useState(0); // 今日のスコア

  // 今日の日付 YYYY-MM-DD
  const getToday = () => new Date().toISOString().slice(0, 10);

  // 初期読み込み
  useEffect(() => {
    const saved = localStorage.getItem("medList");
    if (saved) setMedList(JSON.parse(saved));

    const savedChecked = localStorage.getItem("checkedToday");
    if (savedChecked) setChecked(JSON.parse(savedChecked));

    const savedScore = localStorage.getItem("totalScore");
    if (savedScore) setScore(Number(savedScore));

    const savedTodayScore = localStorage.getItem("score_" + getToday());
    if (savedTodayScore) setTodayScore(Number(savedTodayScore));
  }, []);

  // チェック状況保存
  useEffect(() => {
    localStorage.setItem("checkedToday", JSON.stringify(checked));
  }, [checked]);

  // 累計スコア保存
  useEffect(() => {
    localStorage.setItem("totalScore", String(score));
  }, [score]);

  // 今日のスコア確定ボタン
  const calculateScore = () => {
    // すでに今日スコアがついていたら上書きしない
    if (todayScore > 0) return todayScore;

    const allKeys: string[] = [];
    medList.forEach((m) =>
      m.times.forEach((t) => allKeys.push(`${m.name}_${t}`))
    );

    const checkedCount = allKeys.filter((k) => checked[k]).length;

    if (checkedCount === 0) {
      setTodayScore(0);
      localStorage.setItem("score_" + getToday(), "0");
      return 0;
    }

    const full = checkedCount === allKeys.length;
    const point = full ? 3 : 1;

    setTodayScore(point);
    localStorage.setItem("score_" + getToday(), String(point));

    // 累計に追加
    setScore((prev) => prev + point);

    return point;
  };

  const resetCheck = () => {
    if (!confirm("今日のチェックをリセットしますか？")) return;

    setChecked({});
    localStorage.removeItem("checkedToday");

    setTodayScore(0);
    localStorage.removeItem("score_" + getToday());
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      {/* ← ホームへ戻る */}
      <Link href="/fukuyaku" className="inline-block mb-4 text-blue-600 underline">
        ← 服薬アプリホームに戻る
      </Link>

      <h1 className="text-2xl font-bold mb-4">服薬チェック</h1>

      <p className="mb-3 text-gray-700">
        累計スコア：<b>{score}</b> 点
      </p>
      <p className="mb-6 text-gray-600">今日のスコア：{todayScore} 点</p>

      {medList.length === 0 && (
        <p className="text-gray-600">登録された薬がありません。</p>
      )}

      <div className="space-y-4">
        {medList.map((med, i) => (
          <div key={i} className="border p-3 rounded bg-gray-50">
            <p className="font-bold mb-2">{med.name}</p>

            <div className="space-y-2">
              {med.times.map((t, idx) => {
                const key = `${med.name}_${t}`;

                return (
                  <label
                    key={idx}
                    className="flex items-center space-x-2 p-2 border rounded bg-white"
                  >
                    <input
                      type="checkbox"
                      checked={!!checked[key]}
                      onChange={() =>
                        setChecked((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }))
                      }
                      className="w-5 h-5"
                    />
                    <span>{t}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 今日のスコア確定 */}
      <button
        onClick={calculateScore}
        className="bg-blue-600 text-white p-3 rounded w-full mt-6"
      >
        今日のスコアを確定する
      </button>

      {/* リセット */}
      <button
        onClick={resetCheck}
        className="bg-red-600 text-white p-3 rounded w-full mt-3"
      >
        本日のチェックをリセット
      </button>
    </div>
  );
}
