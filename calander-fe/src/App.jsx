import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "./components/Calendar.jsx";
import TodoInput from "./components/TodoInput.jsx";
import TodoList from "./components/TodoList.jsx";
import StatsChart from "./components/StatsChart.jsx";


const api = axios.create({
  baseURL: "/todo",
  withCredentials: true, // CORS 요청에 자격 증명 포함
});

// 날짜를 "YYYY-MM-DD" 형식의 문자열로 변환하는 함수
const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));
  const [todos, setTodos] = useState({});
  const [stats, setStats] = useState(null);
  const [statsStartDate, setStatsStartDate] = useState("");
  const [statsEndDate, setStatsEndDate] = useState("");
  const [statsError, setStatsError] = useState(null);

  // ✅ 1️⃣ 할 일 목록 가져오기 (GET 요청)
  const fetchTodos = async (dateStr) => {
    try {
      const response = await api.get("", { params: { date: dateStr } });
      setTodos((prevTodos) => ({
        ...prevTodos,
        [dateStr]: response.data.data,
      }));
    } catch (error) {
      console.error("할 일 목록 불러오기 실패:", error);
    }
  };

  // ✅ 2️⃣ 새로운 할 일 추가 (POST 요청)
  const handleAddTodo = async (dateStr, content) => {
    try {
      const response = await api.post("", { date: dateStr, content });
      setTodos((prevTodos) => ({
        ...prevTodos,
        [dateStr]: [...(prevTodos[dateStr] || []), response.data.data],
      }));
    } catch (error) {
      console.error("할 일 추가 실패:", error);
    }
  };

  // ✅ 3️⃣ 할 일 완료 상태 토글 (PATCH 요청)
  const handleToggleTodo = async (todoId) => {
    try {
      const todoToToggle = todos[selectedDate].find((todo) => todo.id === todoId);
      if (!todoToToggle) throw new Error("Todo not found.");

      const response = await api.patch(`/${todoId}/toggle`, {
        isCompleted: !todoToToggle.completed,
      });

      const updatedTodo = response.data.data;

      setTodos((prevTodos) => ({
        ...prevTodos,
        [selectedDate]: prevTodos[selectedDate].map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        ),
      }));
    } catch (error) {
      console.error("🚨 할 일 완료 상태 변경 실패:", error);
    }
  };

  // ✅ 4️⃣ 할 일 삭제 (DELETE 요청)
  const handleDeleteTodo = async (todoId) => {
    try {
      await api.delete("", { params: { todoId } });
      setTodos((prevTodos) => ({
        ...prevTodos,
        [selectedDate]: prevTodos[selectedDate].filter((todo) => todo.id !== todoId),
      }));
    } catch (error) {
      console.error("🚨 할 일 삭제 실패:", error);
    }
  };

  // ✅ 주간/월간 통계 가져오기 (GET 요청)
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
      console.error("🚨 통계 가져오기 실패:", error);
      setStatsError("통계를 불러오는 중 오류가 발생했습니다.");
    }
  };

  const handleStatsSubmit = (e) => {
    e.preventDefault();
    fetchStats();
  };

  // ✅ 한 달 일정 가져오기 (GET 요청)
  const fetchMonthlyTodos = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-31`;

      const response = await api.get("/monthly", { params: { startDate, endDate } });

      const groupedTodos = response.data.data.reduce((acc, todo) => {
        if (!acc[todo.date]) acc[todo.date] = [];
        acc[todo.date].push(todo);
        return acc;
      }, {});

      setTodos(groupedTodos);
    } catch (error) {
      console.error("🚨 한 달 일정 불러오기 실패:", error);
    }
  };

  // ✅ 초기 로드 시 한 달 일정 불러오기
  useEffect(() => {
    fetchMonthlyTodos();
  }, [currentDate]);

  // ✅ 6️⃣ 캘린더에서 날짜 선택 시 해당 날짜의 할 일 불러오기
  const handleDateSelect = (date) => {
    const dateStr = getLocalDateString(date);
    setSelectedDate(dateStr);
    fetchTodos(dateStr);
  };

  return (
    <div className="app-container">
      <h1>TodoList Calendar</h1>
      <Calendar 
        currentDate={currentDate} 
        todos={todos} 
        onDateClick={handleDateSelect}
        getLocalDateString={getLocalDateString}
        selectedDate={selectedDate}
      />
      <div className="controls">
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
          이전 달
        </button>
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
          다음 달
        </button>
      </div>
      <TodoInput onAddTodo={handleAddTodo} getLocalDateString={getLocalDateString} />
      {selectedDate && (
        <TodoList 
          dateStr={selectedDate} 
          todos={todos[selectedDate] || []} 
          onToggleTodo={handleToggleTodo} 
          onModifyTodo={(todoId, content) => console.log(`Modify ${todoId} with ${content}`)} 
          onDeleteTodo={handleDeleteTodo} 
        />
      )}
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
            {/* <p>전체 일정 수: {stats.totalCount}</p>
            <p>완료된 일정 수: {stats.completedCount}</p>
            <p>진행 중인 일정 수: {stats.inProgressCount}</p>
            <p>완료율: {stats.completionRate.toFixed(2)}%</p>
            <p>남은 일정 비율: {stats.inProgressRate.toFixed(2)}%</p> */}
            <StatsChart
              completionRate={stats.completionRate}
              inProgressRate={stats.inProgressRate}
              completedCount={stats.completedCount} // 추가
              inProgressCount={stats.inProgressCount}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;