"use client";

import Link from "next/link";

export default function FirstPost() {
  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">サイトの紹介</h1>

      <p className="leading-relaxed text-gray-700">
        これは俺emini Works の最初の記事です。<br />
        2004年ころから投資を開始。<br />
        才能もお金もなかったので、資産は低迷。<br />
        俺emini Worksとしてせっかくだからいろいろやってみることに。<br />
        Xでも同じ名前でポストしています。
      </p>

      <p className="leading-relaxed text-gray-700">
        服薬アプリもぜひ使ってみてくださいね！
      </p>

      <Link
        href="/blog"
        className="text-blue-600 hover:underline block mt-6"
      >
        ← ブログ一覧に戻る
      </Link>
    </main>
  );
}
