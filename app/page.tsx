import styles from "./page.module.css";
// ★ 1. next/link をインポート
import Link from "next/link";
import { client } from ".././libs/client";

// ★ 2. slug フィールドを型定義に追加
type Gourmet = {
  id: string;
  title: string;
  description: string;
  image: {
    url: string;
  };
  address?: string;
  category?: string;
  slug: string; // ★ microCMSで追加したスラッグ
};

export default async function Home() {
  const data = await client.get({
    endpoint: "gourmet",
  });

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>沖縄おすすめグルメ特集 🍜</h1>
      <div className={styles.grid}>
        {data.contents.map((item: Gourmet) => (
          // ★ 3 & 4. div を Link に置き換え、hrefを設定
          <Link
            key={item.id}
            href={`/gourmet/${item.slug}`}
            className={styles.card} // 既存のスタイルを適用
          >
            <img
              src={item.image.url}
              alt={item.title}
              className={styles.image}
            />
            <h2>{item.title}</h2>
            {/* description は詳細ページでのみ表示する場合、ここから削除してもOKです */}
            <p>{item.description}</p>
            {item.address && <p className={styles.address}>📍{item.address}</p>}
            {item.category && (
              <p className={styles.category}>#{item.category}</p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
