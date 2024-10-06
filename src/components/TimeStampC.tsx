import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { categoryColors } from "../theme/common";
import { TimestampEntry } from "../types";

// ヘルパー関数
////////////////////////////////////////////////////
const formatDuration = (
  startTime: Date | null,
  endTime: Date | null
): string => {
  if (!startTime || !endTime) return "未設定";
  const duration = Math.abs(endTime.getTime() - startTime.getTime());
  const hours = Math.floor(duration / 3600000);
  const minutes = Math.floor((duration % 3600000) / 60000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

// コンポーネント定義
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const TimeStampC: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unfinishedDocId, setUnfinishedDocId] = useState<string | null>(null);
  const [timestamps, setTimestamps] = useState<TimestampEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const categories = Object.keys(categoryColors); // カテゴリーを取得

  /////////////////////データの取得//////////////
  /////////////////////////////////////////////////////////////////////////////////////////////
  const fetchTimestamps = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, "timestamps"),
        orderBy("createdAt", "desc")
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

      const unfinishedTimestamp = fetchedTimestamps.find((ts) => !ts.endTime);
      setUnfinishedDocId(unfinishedTimestamp?.id || null);
    } catch (e) {
      setError("Failed to fetch timestamps");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // タイムスタンプの開始処理 //////
  ////////////////////////////////////////////////////////////////
  const handleStartTimestamp = async () => {
    if (!selectedCategory) {
      setError("Please select a category");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const categoryColor = categoryColors[selectedCategory];

    try {
      const docRef = await addDoc(collection(db, "timestamps"), {
        category: selectedCategory,
        categoryColor,
        createdAt: serverTimestamp(),
      });

      setUnfinishedDocId(docRef.id);
      setSuccessMessage("Start timestamp added!");
      fetchTimestamps();
    } catch (e) {
      setError("Failed to add start timestamp");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  //タイムスタンプの終了処理
  ///////////////////////////////////////////////////////////////
  const handleEndTimestamp = async () => {
    if (!unfinishedDocId) {
      setError("Start timestamp not found");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const docRef = doc(db, "timestamps", unfinishedDocId);
      await updateDoc(docRef, { finishedAt: serverTimestamp() });

      setSuccessMessage("End timestamp added!");
      setUnfinishedDocId(null);
      fetchTimestamps();
    } catch (e) {
      setError("Failed to add end timestamp");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // タイムスタンプの削除処理
  ////////////////////////////////////////////////////////////////////////
  const handleDeleteTimestamp = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteDoc(doc(db, "timestamps", id));
      setSuccessMessage("Timestamp deleted!");
      fetchTimestamps();
    } catch (e) {
      setError("Failed to delete timestamp");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimestamps();
  }, []);

  // レンダリング
  ///////////////////////////////////////////////////////////////////////////////////////
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Typography variant="h6">習慣のタイムスタンプを送信</Typography>

      <FormControl sx={{ mt: 2, width: "200px" }}>
        <InputLabel id="category-select-label">カテゴリー</InputLabel>
        <Select
          labelId="category-select-label"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleStartTimestamp}
        disabled={loading || unfinishedDocId !== null}
        sx={{ mt: 2 }}
      >
        {loading && unfinishedDocId === null ? (
          <CircularProgress size={24} />
        ) : (
          "開始タイムスタンプを送信"
        )}
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleEndTimestamp}
        disabled={loading || unfinishedDocId === null}
        sx={{ mt: 2 }}
      >
        {loading && unfinishedDocId !== null ? (
          <CircularProgress size={24} />
        ) : (
          "終了タイムスタンプを送信"
        )}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Box mt={4} width="100%">
        <Typography variant="h6" gutterBottom>
          タイムスタンプ一覧
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          timestamps.map((timestamp) => (
            <Box
              key={timestamp.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              p={2}
              sx={{
                backgroundColor:
                  categoryColors[timestamp.category] || "#f5f5f5", // カテゴリーの色を適用
                borderRadius: 2,
              }}
            >
              <Box>
                <Typography variant="body1">
                  カテゴリー: {timestamp.category}
                </Typography>
                <Typography variant="body2">
                  開始: {timestamp.startTime?.toLocaleString() || "未設定"}
                </Typography>
                <Typography variant="body2">
                  終了: {timestamp.endTime?.toLocaleString() || "未設定"}
                </Typography>
                <Typography variant="body2">
                  経過時間:{" "}
                  {formatDuration(timestamp.startTime, timestamp.endTime)}
                </Typography>
              </Box>
              <IconButton
                color="error"
                onClick={() => handleDeleteTimestamp(timestamp.id)}
              >
                <Delete />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default TimeStampC;
