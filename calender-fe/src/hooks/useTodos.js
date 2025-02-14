import { useState, useEffect } from "react";
import { fetchTodos, addTodo, toggleTodo, deleteTodo, fetchMonthlyTodos } from "../services/todoService";

const useTodos = (currentDate) => {
  const [todos, setTodos] = useState({});
  const [selectedDate, setSelectedDate] = useState("");

  // 한 달 일정 가져오기
  useEffect(() => {
    const loadMonthlyTodos = async () => {
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-31`;

      try {
        const monthlyTodos = await fetchMonthlyTodos(startDate, endDate);
        const groupedTodos = monthlyTodos.reduce((acc, todo) => {
          if (!acc[todo.date]) acc[todo.date] = [];
          acc[todo.date].push(todo);
          return acc;
        }, {});
        setTodos(groupedTodos);
      } catch (error) {
        console.error("🚨 한 달 일정 불러오기 실패:", error);
      }
    };
    loadMonthlyTodos();
  }, [currentDate]);

  // 특정 날짜의 할 일 불러오기
  const loadTodos = async (dateStr) => {
    try {
      const fetchedTodos = await fetchTodos(dateStr);
      setTodos((prev) => ({ ...prev, [dateStr]: fetchedTodos }));
    } catch (error) {
      console.error("🚨 할 일 목록 불러오기 실패:", error);
    }
  };

  // 할 일 추가
  const handleAddTodo = async (dateStr, content) => {
    try {
      const newTodo = await addTodo(dateStr, content);
      setTodos((prev) => ({
        ...prev,
        [dateStr]: [...(prev[dateStr] || []), newTodo],
      }));
    } catch (error) {
      console.error("🚨 할 일 추가 실패:", error);
    }
  };

  // 할 일 완료 상태 변경
  const handleToggleTodo = async (todoId, dateStr) => {
    try {
      const todoToToggle = todos[dateStr].find((todo) => todo.id === todoId);
      if (!todoToToggle) return;

      const updatedTodo = await toggleTodo(todoId, !todoToToggle.completed);

      setTodos((prev) => ({
        ...prev,
        [dateStr]: prev[dateStr].map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        ),
      }));
    } catch (error) {
      console.error("🚨 할 일 상태 변경 실패:", error);
    }
  };

  // 할 일 삭제
  const handleDeleteTodo = async (todoId, dateStr) => {
    try {
      await deleteTodo(todoId);
      setTodos((prev) => ({
        ...prev,
        [dateStr]: prev[dateStr].filter((todo) => todo.id !== todoId),
      }));
    } catch (error) {
      console.error("🚨 할 일 삭제 실패:", error);
    }
  };

    // ✅ 할 일 수정 (날짜 변경 포함)
    const handleUpdateTodo = async (todoId, oldDate, newDate, newContent) => {
      try {
        const updatedTodo = await updateTodo(todoId, newDate, newContent);
  
        setTodos((prev) => {
          const newTodos = { ...prev };
  
          // 기존 날짜에서 제거
          newTodos[oldDate] = newTodos[oldDate].filter((todo) => todo.id !== todoId);
  
          // 새로운 날짜에 추가
          if (!newTodos[newDate]) {
            newTodos[newDate] = [];
          }
          newTodos[newDate].push(updatedTodo);
  
          return newTodos;
        });
      } catch (error) {
        console.error("🚨 할 일 수정 실패:", error);
      }
    };

  return {
    todos,
    selectedDate,
    setSelectedDate,
    loadTodos,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
  };
};

export default useTodos;