🚀 沖縄グルメ特集 Next.js/microCMS サイト
このプロジェクトは、Next.js の App Router とヘッドレス CMS である microCMS を利用して構築された、沖縄のグルメ情報を紹介する静的サイトです。

🎯 1. サイトの主な機能
本サイトは、以下の機能を実装しています。

① グルメ一覧表示機能:

・トップページ（/）にて、microCMS から取得した沖縄のグルメ情報（店名、画像、住所など）をカード形式で一覧表示します。

② 詳細ページ機能 (動的ルーティング):

・一覧ページの各カードをクリックすると、対応するグルメの詳細ページ（例: /gourmet/mame_porepore）へ遷移します。

・URL からスラッグ（slug）を取得し、そのスラッグに紐づく詳細な店舗情報を microCMS から取得して表示します。

③ 一覧ページへの戻る機能:

・詳細ページには、「一覧に戻る」ボタンを設置しており、トップページ（/）へスムーズに戻ることができます。

④ 静的サイト生成 (SSG):

・Next.js の generateStaticParams を利用し、ビルド時にすべての詳細ページを静的ファイルとして事前生成します。これにより、表示速度が向上します。

📄 2. ページ構成
本プロジェクトは、以下の 2 つの主要なページで構成されています。

URL パス,ページ名,対応ファイル,役割
/,トップページ / 一覧,app/page.tsx,microCMS からすべてのグルメ情報を取得し、概要をカード形式で一覧表示します。
/gourmet/[slug],詳細ページ,app/gourmet/[slug]/page.tsx,URL の[slug]に基づいて、個別のグルメ情報を取得し、詳細を表示します。

📁 3. ディレクトリ構成
主要なコードや設定ファイルは以下の通りです。

okinawa-travel2/
├── app/
│ ├── gourmet/ # 詳細ページ（動的ルーティング）を定義するフォルダ
│ │ └── [slug]/
│ │ ├── page.tsx # 詳細ページ本体のロジックと UI
│ │ └── page.module.css # 詳細ページ専用のスタイル
│ ├── page.tsx # トップページ（一覧）本体のロジックと UI
│ └── page.module.css # トップページ専用のスタイル
├── libs/
│ └── client.ts # microCMS 接続クライアント定義
├── public/ # 画像などの静的ファイルを格納
├── package.json # プロジェクトの依存関係とスクリプト定義
└── ... (その他の設定ファイル)

📡 4. microCMS へのアクセス処理
本プロジェクトでは、@microcms/sdk を使用して microCMS からデータを取得しています。

クライアント定義 (libs/client.ts)
API キーとサービス ID を環境変数から読み込み、SDK クライアントを初期化しています。⬇

// libs/client.ts (イメージ)
import { createClient } from 'microcms-js-sdk';

export const client = createClient({
serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN, // 環境変数から取得
apiKey: process.env.MICROCMS_API_KEY, // 環境変数から取得
});

ーデータ取得ロジックー
① 一覧ページ (app/page.tsx)
エンドポイント gourmet に対して client.get() を実行し、すべてのグルメ情報を取得しています。⬇

// すべてのグルメ情報を取得
const data = await client.get({ endpoint: "gourmet" });

② 詳細ページ (app/gourmet/[slug]/page.tsx)
URL から取得した slug パラメーターを利用し、filters を使って一致する 1 件のデータのみを取得しています。⬇

// スラッグを使って 1 件のデータをフィルタリング
const response = await client.get({
endpoint: "gourmet",
queries: {
filters: `slug[equals]${slug}`,
limit: 1, // 取得件数を 1 件に限定
},
});

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
