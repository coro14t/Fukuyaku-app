import Link from "next/link";

// ← ここで日付を定義
const publishedDate = "2026-4-20";

export default function FirstPost() {
  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">封筒印刷</h1>

      {/* 日付表示 */}
      <p className="text-sm text-gray-500">
        公開日：{publishedDate}
      </p>

      <p className="leading-relaxed text-gray-700">
        報告書を送付するとき、封筒の宛名書きって面倒。<br />
        Wordでひな型作っていたら、PCやプリンターの環境で印刷がずれるので都度調整。<br />
        いっそのこと環境に左右されないようにHP上で公開してみたらいいのではとChat　GPTに相談。<br />
        試しに作って公開しています。<br />
        とは言え環境に左右される可能性もあるのでご了承ください。<br />
        用紙はA4、余白はなしで印刷するといいと思います。<br /><br />
        【使い方】<br />
        ①スプレッドシートにA～Dまで入力<br />
        A：宛名<br />
        B：郵便番号<br />
        C：宛先住所<br />
        D：クリニック名<br />
        E：メモ（印刷されません）<br />
        ②ダウンロード：カンマ区切り形式（.CSV）<br />
        →文字化けしても大丈夫です<br />
        ③ファイル選択で②のファイルを選択<br />
        ④印刷をクリック
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
