import React, { useState, useEffect } from "react";
import { createTodoApi } from "./services/todoService";
import Calendar from "./components/Calendar";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import StatsContainer from "./components/StatsContainer";
import { getLocalDateString } from "./utils/date";

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));
  const [todos, setTodos] = useState({});

  const todoApi = createTodoApi(setTodos);

  useEffect(() => {
    todoApi.fetchMonthlyTodos(currentDate);
  }, [currentDate]);

  const handleDateSelect = (date) => {
    const dateStr = getLocalDateString(date);
    setSelectedDate(dateStr);
    todoApi.fetchTodos(dateStr);
  };

  return (
    <div className="app-container">
      <h1>TodoList 캘린더</h1>
      <Calendar 
        currentDate={currentDate} 
        todos={todos} 
        onDateClick={handleDateSelect}
        selectedDate={selectedDate}
        getLocalDateString={getLocalDateString}
      />
      <div className="controls">
        <button onClick={() => 
          setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() - 1); 
            return newDate;
          })
        }>
          이전 달
        </button>
        <button onClick={() => 
          setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
          })
        }>
          다음 달
        </button>
      </div>
      <TodoInput onAddTodo={todoApi.handleAddTodo} />
      {selectedDate && (
        <TodoList 
        dateStr={selectedDate} 
        todos={todos[selectedDate] || []} 
        onToggleTodo={(todoId) => todoApi.handleToggleTodo(selectedDate, todoId, todos[selectedDate])}
        onDeleteTodo={(todoId) => todoApi.handleDeleteTodo(selectedDate, todoId)}
        onUpdateTodo={(todoId, dateStr, newContent) => todoApi.handleUpdateTodo(todoId, dateStr, newContent)}
      />
      )}
      <StatsContainer />
    </div>
  );
};

export default App;