"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* ヘッダー画像 */}
      <div className="w-full h-56 relative mb-8">
        <Image
          src="/header.png"
          alt="Header"
          fill
          style={{ objectFit: "contain", objectPosition: "center" }}
          className="object-cover rounded-b-lg shadow"
        />
      </div>

      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-center mb-4">
          俺emini Works
        </h1>

        <p className="text-center text-gray-700 mb-10 leading-relaxed">
          個人が自由に技術を楽しむ場所へようこそ。<br />
          開発したツールやアプリを公開しています。
        </p>

        {/* カードボタン */}
        <div className="grid gap-4">

          {/* 服薬アプリ */}
          <Link
            href="/fukuyaku"
            className="bg-green-500 hover:bg-green-600 text-white text-center py-4 rounded-lg shadow"
          >
            ▶ 服薬アプリを開く
          </Link>

          {/* 封筒印刷アプリ */}
          <Link
            href="/envelope"
            className="bg-orange-500 hover:bg-orange-600 text-white text-center py-4 rounded-lg shadow"
          >
            ▶ 封筒印刷アプリを開く
          </Link>

          {/* 在宅書類作成 */}
          <Link
            href="/homecare-docs"
            className="bg-purple-500 hover:bg-purple-600 text-white text-center py-4 rounded-lg shadow"
          >
            ▶ 在宅書類作成
          </Link>

          {/* ブログ */}
          <Link
            href="/blog"
            className="bg-blue-500 hover:bg-blue-600 text-white text-center py-4 rounded-lg shadow"
          >
            ▶ ブログを見る
          </Link>

          {/* Xリンク */}
          <Link
            href="https://x.com/@CORO43003864"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black hover:bg-gray-800 text-white text-center py-4 rounded-lg shadow"
          >
            ▶ X（Twitter）を見る
          </Link>

        </div>

        <footer className="mt-14 text-center text-gray-500 text-sm">
          © 2025 Oremini Works
        </footer>
      </div>
    </main>
  );
}
