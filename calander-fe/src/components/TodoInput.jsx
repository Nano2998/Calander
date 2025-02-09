import React, { useState } from "react";

const TodoInput = ({ onAddTodo, getLocalDateString }) => {
  const today = getLocalDateString(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim() === "") return;
    
    try {
      await onAddTodo(selectedDate, content);
      setContent(""); // ✅ 입력 필드 초기화
    } catch (error) {
      console.error("🚨 할 일 추가 중 오류 발생:", error);
    }
  };

  return (
    <div className="todo-input-container">
      <form onSubmit={handleSubmit}>
        <label>
          날짜:
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
          />
        </label>
        <label>
          할일:
          <input 
            type="text" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="해야할 일을 입력하세요" 
          />
        </label>
        <button type="submit">추가</button>
      </form>
    </div>
  );
};

export default TodoInput;