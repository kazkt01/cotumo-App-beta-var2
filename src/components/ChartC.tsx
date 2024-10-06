import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { categoryColors } from "../theme/common";
import { TimestampEntry } from "../types";

Chart.register(...registerables); // Chart.jsの登録

interface Dataset {
  type: "line"; // 折れ線グラフの場合
  label: string; // カテゴリー名
  data: number[]; // 各データポイント
  fill: boolean; // 塗りつぶしの有無
  borderColor: string; // 線の色
  tension: number; // 曲線の張力
}

const ChartC: React.FC = () => {
  const [timestamps, setTimestamps] = useState<TimestampEntry[]>([]);
  const [loading, setLoading] = useState(true);
  // Firestoreからタイムスタンプデータを取得する関数
  ////////////////////////////////////////////////////////////////////////
  const fetchTimestamps = async () => {
    try {
      const q = query(
        collection(db, "timestamps"),
        orderBy("createdAt", "asc") // 古い順に並べ替え
      );
      const querySnapshot = await getDocs(q);
      const fetchedTimestamps: TimestampEntry[] = querySnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          category: doc.data().category,
          startTime: doc.data().createdAt?.toDate() || null,
          endTime: doc.data().finishedAt?.toDate() || null,
        })
      );

      setTimestamps(fetchedTimestamps);
    } catch (e) {
      console.error("Failed to fetch timestamps", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimestamps();
  }, []);

  // グラフデータの準備
  //////////////////////////////////////////////////////////
  const prepareChartData = () => {
    const labels: string[] = [];
    const datasets: Dataset[] = [];

    const dataByDateAndCategory: {
      [date: string]: { [category: string]: number };
    } = {};

    // 日付ごとにデータを整理
    /////////////////////////////////////////////////////
    timestamps.forEach((timestamp) => {
      const dateLabel = timestamp.startTime
        ? timestamp.startTime.toISOString().split("T")[0] // ISO形式で日付を取得
        : "未設定";
      const duration =
        timestamp.startTime && timestamp.endTime
          ? Math.abs(
              timestamp.endTime.getTime() - timestamp.startTime.getTime()
            ) / 3600000 // 時間に変換
          : 0;

      // 日付ごとにカテゴリーを分類
      //////////////////////////////////////////////////////
      if (!dataByDateAndCategory[dateLabel]) {
        dataByDateAndCategory[dateLabel] = {};
      }

      if (!dataByDateAndCategory[dateLabel][timestamp.category]) {
        dataByDateAndCategory[dateLabel][timestamp.category] = 0;
      }

      dataByDateAndCategory[dateLabel][timestamp.category] += duration;

      // ラベル（日付）がまだ追加されていない場合、追加
      if (!labels.includes(dateLabel)) {
        labels.push(dateLabel);
      }
    });

    // 各カテゴリーごとのデータセットを作成
    Object.keys(categoryColors).forEach((category) => {
      const categoryData: number[] = labels.map(
        (dateLabel) => dataByDateAndCategory[dateLabel]?.[category] || 0
      );

      datasets.push({
        type: "line",
        label: category,
        data: categoryData,
        fill: false,
        borderColor: categoryColors[category],
        tension: 0.1,
      });
    });

    return {
      labels,
      datasets,
    };
  };

  const chartData = prepareChartData();

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>習慣の時間グラフ</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Line
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets,
          }}
          options={{
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: "日付",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "時間",
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default ChartC;
