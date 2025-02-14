import React, { useState } from "react";
import axios from "axios";
import StatsChart from "./StatsChart";

const api = axios.create({
  baseURL: "/todo",
  withCredentials: true,
});

const StatsContainer = () => {
  const [statsStartDate, setStatsStartDate] = useState("");
  const [statsEndDate, setStatsEndDate] = useState("");
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState(null);

  const fetchStats = async () => {
    try {
      if (!statsStartDate || !statsEndDate) {
        setStatsError("시작 날짜와 끝 날짜를 입력하세요.");
        return;
      }
      const response = await api.get("/calendar/stats", {
        params: { startDate: statsStartDate, endDate: statsEndDate },
      });

      const data = response.data.data;
      setStats({
        totalCount: data.totalCount || 0,
        completedCount: data.completedCount || 0,
        inProgressCount: data.inProgressCount || 0,
        completionRate: data.completionRate || 0,
        inProgressRate: data.inProgressRate || 0,
      });
      setStatsError(null);
    } catch (error) {
      console.error("통계 가져오기 실패:", error);
      setStatsError("통계를 불러오는 중 오류가 발생했습니다.");
    }
  };

  const handleStatsSubmit = (e) => {
    e.preventDefault();
    fetchStats();
  };

  return (
    <div className="stats-container">
      <h2>주간/월간 통계</h2>
      <form onSubmit={handleStatsSubmit}>
        <label>
          시작 날짜:
          <input
            type="date"
            value={statsStartDate}
            onChange={(e) => setStatsStartDate(e.target.value)}
          />
        </label>
        <label>
          끝 날짜:
          <input
            type="date"
            value={statsEndDate}
            onChange={(e) => setStatsEndDate(e.target.value)}
          />
        </label>
        <button type="submit">통계 조회</button>
      </form>
      {statsError && <p style={{ color: "red" }}>{statsError}</p>}
      {stats && (
        <div className="stats-results">
          <StatsChart
            completionRate={stats.completionRate}
            inProgressRate={stats.inProgressRate}
            completedCount={stats.completedCount}
            inProgressCount={stats.inProgressCount}
          />
        </div>
      )}
    </div>
  );
};

export default StatsContainer;