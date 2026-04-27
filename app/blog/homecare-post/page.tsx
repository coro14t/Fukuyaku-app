import Link from "next/link";

// ← ここで日付を定義
const publishedDate = "2026-4-25";

export default function FirstPost() {
  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">書類依頼</h1>

      {/* 日付表示 */}
      <p className="text-sm text-gray-500">
        公開日：{publishedDate}
      </p>

      <p className="leading-relaxed text-gray-700">
        封筒と同じで書類作成も大変。<br />
        これもWordでひな型作っていたものをネット版にしてみました。<br />
        項目に関しては必要なものが抜けていてもご了承ください。<br />
        用紙はA4、余白はなしで印刷するといいと思います。<br /><br />
        【使い方】<br />
        それぞれ必要項目を入力して印刷してください。<br />
        医療機関に記載して返送してもらうことを想定しています。
      </p>

      <p className="leading-relaxed text-gray-700">
        気ままに他にも作るかもしれません。
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
