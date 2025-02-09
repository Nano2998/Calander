import React from "react";

const TodoList = ({ dateStr, todos, onToggleTodo, onDeleteTodo }) => {
  const handleToggle = async (todoId) => {
    try {
      await onToggleTodo(todoId);
    } catch (error) {
      console.error("🚨 할 일 완료 상태 변경 실패:", error);
    }
  };

  const handleDelete = async (todoId) => {
    try {
      await onDeleteTodo(todoId);
    } catch (error) {
      console.error("🚨 할 일 삭제 실패:", error);
    }
  };

  return (
    <div className="todo-list-container">
      <h3>{dateStr}의 일정</h3>
      {todos.length === 0 ? (
        <p>등록된 일정이 없습니다.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
            <input 
              type="checkbox" 
              checked={todo.completed} 
              onChange={() => handleToggle(todo.id, !todo.completed)} // ✅ 새 상태 전달
            />
              <span>{todo.content}</span>
              <button onClick={() => handleDelete(todo.id)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;