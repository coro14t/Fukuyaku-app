"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold mb-6">服薬アプリ</h1>

      {/* 服薬登録 */}
      <Link
        href="/add"
        className="block bg-blue-600 text-white p-4 rounded shadow text-center"
      >
        薬を登録する
      </Link>

      {/* チェック */}
      <Link
        href="/check"
        className="block bg-green-600 text-white p-4 rounded shadow text-center"
      >
        今日の服薬チェック
      </Link>

      {/* 牧場を見る（ここが今回の重要ポイント） */}
      <Link
        href="/farm"
        className="block bg-yellow-600 text-white p-4 rounded shadow text-center"
      >
        牧場を見る
      </Link>
    </div>
  );
}
