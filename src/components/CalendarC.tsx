import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { categoryColors } from "../theme/common"; // カテゴリー色を定義しているファイルからインポート
import { TimestampEntry } from "../types/index";
import { EventClickArg } from "@fullcalendar/core/index.js";

const CalendarC: React.FC = () => {
  const [events, setEvents] = useState<TimestampEntry[]>([]); // イベントデータの状態管理

  // Firebaseからイベントを取得
  const fetchEvents = async () => {
    const q = query(collection(db, "timestamps"), orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);
    const eventsData: TimestampEntry[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        category: data.category,
        startTime: data.createdAt?.toDate() || null,
        endTime: data.finishedAt?.toDate() || null,
      };
    });
    setEvents(eventsData); // 状態を更新
  };

  // 初回レンダリング時にイベントを取得
  useEffect(() => {
    fetchEvents();
  }, []);

  // フルカレンダー用のイベントデータを準備
  const prepareCalendarEvents = (timestamps: TimestampEntry[]) => {
    return timestamps.map((timestamp) => ({
      id: timestamp.id,
      title: timestamp.category,
      start: timestamp.startTime || undefined,
      end: timestamp.endTime || undefined,
      color: categoryColors[timestamp.category], // カテゴリーごとの色を取得
    }));
  };

  // クリックイベントのハンドラ
  const handleEventClick = (info: EventClickArg) => {
    const eventTitle = info.event.title;
    const startTime = info.event.start?.toLocaleString();
    const endTime = info.event.end?.toLocaleString() || "終了未設定";

    alert(`イベント: ${eventTitle}\n開始: ${startTime}\n終了: ${endTime}`);
  };

  // レンダリング
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={prepareCalendarEvents(events)} // 整形したイベントデータを使用
        editable={true}
        selectable={true}
        eventClick={handleEventClick} // クリックイベントハンドリング
      />
    </div>
  );
};

export default CalendarC;
