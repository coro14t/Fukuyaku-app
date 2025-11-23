"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getFarmLevel } from "../../components/level";
import { farmImages } from "../../components/farmImages";

export default function FarmPage() {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  // 次レベルまでに必要なスコア
  const getNextLevelScore = (lv: number) => {
    switch (lv) {
      case 1: return 10;
      case 2: return 30;
      case 3: return 60;
      case 4: return 100;
      case 5: return 150;
      default: return 150;
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("totalScore");
    const s = saved ? Number(saved) : 0;
    setScore(s);

    setLevel(getFarmLevel(s));
  }, []);

  const nextLevelScore = getNextLevelScore(level);
  const prevLevelScore = getNextLevelScore(level - 1) ?? 0;

  // 現在レベル内でどれだけ進んだか（％）
  const progress = Math.min(
    100,
    Math.max(0, ((score - prevLevelScore) / (nextLevelScore - prevLevelScore)) * 100)
  );

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <Link href="/" className="text-blue-600 underline block mb-4">
        ← ホームに戻る
      </Link>

      <h1 className="text-2xl font-bold mb-4">あなたの牧場</h1>
      <p className="mb-2">累計スコア: {score} 点</p>
      <p className="mb-4">牧場レベル: {level}</p>

      {/* XPバー */}
      {level < 6 ? (
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-1">
            次のレベルまで：あと <b>{nextLevelScore - score}</b> 点
          </p>
          <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-green-500 transition-all duration-500"
            ></div>
          </div>
        </div>
      ) : (
        <p className="mb-6 text-green-700 font-bold">最高レベルです！</p>
      )}

      <div className="border rounded p-3 bg-white shadow">
        <Image
          src={farmImages[level]}
          alt={`Farm level ${level}`}
          width={300}
          height={300}
          className="mx-auto"
        />
      </div>
    </div>
  );
}
