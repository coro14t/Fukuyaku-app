import Link from "next/link";

// ← ここで日付を定義
const publishedDate = "2026-5-5";

export default function FirstPost() {
  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">リフィル処方せん案内</h1>

      {/* 日付表示 */}
      <p className="text-sm text-gray-500">
        公開日：{publishedDate}
      </p>

      <p className="leading-relaxed text-gray-700">
        リフィル処方せんの有効期限ってわかりにくいと思う。<br />
        ちょっとでも有効期限を過ぎてしまうと使えなくなるので、案内は大切だと思う。<br />
        もともとはスプレッドシートで作成していたんだけど、数式ずれてしまっても困るし<br />
        名前が残っちゃっても渡し間違いになる。<br />
        そこで同じようにネットに掲載できる形で作ってみた。<br />
        正直今までで一番時間かかった。<br />
        知識があればこんなに時間かからないんだろうけどね。<br /><br />
        【使い方】<br />
        それぞれ必要項目を入力して、余白なしで印刷する。
      </p>

      <p className="leading-relaxed text-gray-700">
        あとなんか便利になるものあるだろうか？
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
