import Link from "next/link";

// ← ここで日付を定義
const publishedDate = "2025-12-12";

export default function FirstPost() {
  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">サイトの紹介</h1>

      {/* 日付表示 */}
      <p className="text-sm text-gray-500">
        公開日：{publishedDate}
      </p>

      <p className="leading-relaxed text-gray-700">
        これは俺emini Works の最初の記事です。<br />
        2004年ころから投資を開始。<br />
        才能もお金もなかったので、資産は低迷。<br />
        投資もAIまかせにしてみようと実験中<br />
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
