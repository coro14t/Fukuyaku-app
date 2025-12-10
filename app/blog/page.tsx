"use client";

import Link from "next/link";

export default function BlogHome() {
  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        ブログ
      </h1>

      <p className="text-center text-gray-600">
        最新の記事はこちらから
      </p>

      <div className="space-y-2">
        <Link
          href="/blog/first-post"
          className="text-blue-600 hover:underline"
        >
          サイトの紹介 →
        </Link>
      </div>

      <div className="text-center mt-8">
        <Link
          href="/"
          className="text-blue-600 hover:underline"
        >
          ← ホームに戻る
        </Link>
      </div>
    </main>
  );
}
