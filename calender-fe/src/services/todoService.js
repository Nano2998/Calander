import axios from "axios";

const api = axios.create({
  baseURL: "/todo",
  withCredentials: true,
});

export const createTodoApi = (setTodos) => ({
  fetchTodos: async (dateStr) => {
    try {
      const response = await api.get("", { params: { date: dateStr } });
      setTodos((prevTodos) => ({
        ...prevTodos,
        [dateStr]: response.data.data,
      }));
    } catch (error) {
      console.error("할 일 목록 불러오기 실패:", error);
    }
  },

  handleAddTodo: async (dateStr, content) => {
    try {
      const response = await api.post("", { date: dateStr, content });
      setTodos((prevTodos) => ({
        ...prevTodos,
        [dateStr]: [...(prevTodos[dateStr] || []), response.data.data],
      }));
    } catch (error) {
      console.error("할 일 추가 실패:", error);
    }
  },

  handleToggleTodo: async (selectedDate, todoId) => {
    try {
        setTodos(prevTodos => ({
            ...prevTodos,
            [selectedDate]: prevTodos[selectedDate].map(todo =>
                todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
            ),
        }));
        await api.patch(`/${todoId}/toggle`, {});

    } catch (error) {
        console.error("할 일 완료 상태 변경 실패:", error);
    }
},

  handleDeleteTodo: async (selectedDate, todoId) => {
    try {
      await api.delete(`/${todoId}`);
      setTodos((prevTodos) => ({
        ...prevTodos,
        [selectedDate]: prevTodos[selectedDate].filter((todo) => todo.id !== todoId),
      }));
    } catch (error) {
      console.error("할 일 삭제 실패:", error);
    }
  },

  fetchMonthlyTodos: async (currentDate) => {
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
      console.error("한 달 일정 불러오기 실패:", error);
    }
  },

  handleUpdateTodo: async (todoId, dateStr, newContent) => {
    try {
      // ✅ 1. 서버에 수정 요청
      const response = await api.patch(`/${todoId}`, { 
        date: dateStr,
        content: newContent
      });
  
      // ✅ 2. 백엔드 응답 데이터 확인
      const updatedTodo = response.data.data;
  
      // ✅ 3. Null 값 방어 코드 추가
      if (!updatedTodo.content) updatedTodo.content = newContent;
      if (!updatedTodo.date) updatedTodo.date = dateStr;
  
      // ✅ 4. 상태 즉시 반영 (기존 데이터 유지)
      setTodos((prevTodos) => ({
        ...prevTodos,
        [dateStr]: prevTodos[dateStr]?.map((todo) =>
          todo.id === todoId ? updatedTodo : todo
        ) || [],
      }));
    } catch (error) {
      console.error("🚨 할 일 수정 실패:", error);
    }
  },
});