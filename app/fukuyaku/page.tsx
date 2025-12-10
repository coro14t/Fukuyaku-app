"use client";

import Link from "next/link";

export default function FukuyakuHome() {
  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">

      {/* 戻るリンク */}
      <Link
        href="/"
        className="text-blue-600 underline"
      >
        ← ホームへ戻る
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-center">服薬アプリ</h1>

      <Link
        href="/add"
        className="block bg-blue-600 hover:bg-blue-700 text-white p-4 rounded shadow text-center"
      >
        薬を登録する
      </Link>

      <Link
        href="/check"
        className="block bg-green-600 hover:bg-green-700 text-white p-4 rounded shadow text-center"
      >
        今日の服薬チェック
      </Link>

      <Link
        href="/farm"
        className="block bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded shadow text-center"
      >
        牧場を見る
      </Link>

    </div>
  );
}
