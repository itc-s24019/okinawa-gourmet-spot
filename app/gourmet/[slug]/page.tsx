// app/gourmet/[slug]/page.tsx

// 必要なものをインポート
import { client } from "@/libs/client"; // microCMSのAPIクライアント（ご自身のパスに修正してください）
import styles from "./page.module.css"; // 詳細ページ用のCSSファイル
import { notFound } from "next/navigation"; // データが見つからなかった場合に404ページを表示
// ★ 1. next/link をインポート
import Link from "next/link";

// APIレスポンスの型定義
type GourmetDetail = {
  id: string;
  store: string; // 店名 (一覧のtitleフィールドが実際にはstore名と仮定)
  explanation: string; // 説明文 (一覧のdescriptionフィールドが実際にはexplanationと仮定)
  image: {
    url: string;
  };
  address: string;
  category: string;
  slug: string; // 詳細取得に使うスラッグ
};

// Next.jsの動的ルートからパラメーターを取得するための型
type Props = {
  params: {
    slug: string; // URLから 'mame_porepore' などが入る
  };
};

export async function generateStaticParams() {
  // microCMSから全グルメデータを取得
  const data = await client.get({ endpoint: "gourmet" });

  // 取得したデータから、slugのリストを作成
  return data.contents.map((item: { slug: string }) => ({
    slug: item.slug,
  }));
}

export default async function GourmetDetail({ params }: Props) {
  const { slug } = params;

  let detailData: GourmetDetail;

  try {
    // スラッグを使って microCMS のデータを取得
    const response = await client.get({
      endpoint: "gourmet",
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1, // 1件だけ取得
      },
    });

    // 取得結果がない場合は notFound() を呼び出し、Next.jsの404ページを表示
    if (!response.contents || response.contents.length === 0) {
      notFound();
    }

    // 最初のアイテムを詳細データとする
    detailData = response.contents[0] as GourmetDetail;
  } catch (error) {
    // API通信エラーなどの場合は、エラーログを出力して404とする
    console.error("MicroCMS data fetching failed:", error);
    notFound();
  }

  // 取得したデータを使って詳細情報を表示
  return (
    <main className={styles.container}>
      {/* ----------------------------------------------------------------- */}
      {/* ★ 2. 「一覧に戻る」ボタンの追加 (Linkタグでトップページ "/" にリンク) */}
      <div className={styles.backLinkContainer}>
        <Link href="/" className={styles.backLinkButton}>
          ← 一覧に戻る
        </Link>
      </div>
      {/* ----------------------------------------------------------------- */}

      <h1 className={styles.title}>{detailData.store}</h1>

      {/* メイン画像 */}
      <img
        src={detailData.image.url}
        alt={detailData.store}
        className={styles.mainImage}
      />

      {/* 詳細情報セクション */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>お店の説明</h2>
        {/* description(explanation)はリッチエディタの可能性があるので、dangerouslySetInnerHTMLを使用 */}
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: detailData.explanation }}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>基本情報</h2>
        <p className={styles.infoText}>
          <span className={styles.infoLabel}>🏠 住所:</span>{" "}
          {detailData.address}
        </p>
        <p className={styles.infoText}>
          <span className={styles.infoLabel}>🏷️ カテゴリ:</span>{" "}
          {detailData.category}
        </p>
      </div>

      {/* 追加の情報を表示できます */}
    </main>
  );
}
