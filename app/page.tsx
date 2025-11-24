import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Link Like Essentials
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Link! Like! ラブライブ! のカードデッキビルダー
          </p>
          <Link
            href="/deck"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            デッキビルダーを開く
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              機能について
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>9人のキャラクター × 2枚 = 18枚のカードでデッキを編成</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>レアリティ、スタイルタイプ、限定区分でフィルタリング</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>カードの詳細情報を確認</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>デッキの保存・読み込み（LocalStorage）</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              対応キャラクター
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-gray-700">
              <div>• セラス</div>
              <div>• 桂城泉</div>
              <div>• フリー</div>
              <div>• 百生吟子</div>
              <div>• 徒町小鈴</div>
              <div>• 安養寺姫芽</div>
              <div>• 日野下花帆</div>
              <div>• 村野さやか</div>
              <div>• 大沢瑠璃乃</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
