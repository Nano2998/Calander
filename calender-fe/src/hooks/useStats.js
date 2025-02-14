import { useState } from "react";
import { fetchStats } from "../services/todoService";

const useStats = () => {
  const [stats, setStats] = useState(null);
  const [statsStartDate, setStatsStartDate] = useState("");
  const [statsEndDate, setStatsEndDate] = useState("");
  const [statsError, setStatsError] = useState(null);

  const fetchStatsData = async () => {
    try {
      if (!statsStartDate || !statsEndDate) {
        setStatsError("시작 날짜와 끝 날짜를 입력하세요.");
        return;
      }
      const data = await fetchStats(statsStartDate, statsEndDate);
      setStats({
        totalCount: data.totalCount || 0,
        completedCount: data.completedCount || 0,
        inProgressCount: data.inProgressCount || 0,
        completionRate: data.completionRate || 0,
        inProgressRate: data.inProgressRate || 0,
      });
      setStatsError(null);
    } catch (error) {
      console.error("🚨 통계 가져오기 실패:", error);
      setStatsError("통계를 불러오는 중 오류가 발생했습니다.");
    }
  };

  return {
    stats,
    statsStartDate,
    statsEndDate,
    setStatsStartDate,
    setStatsEndDate,
    statsError,
    fetchStatsData,
  };
};

export default useStats;