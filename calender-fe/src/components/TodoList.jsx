import React, { useState } from "react";

const TodoList = ({ dateStr, todos, onToggleTodo, onDeleteTodo, onUpdateTodo }) => {
  const [editingTodo, setEditingTodo] = useState(null);
  const [updatedContent, setUpdatedContent] = useState("");

  // 수정 버튼 클릭 시 (현재 내용을 입력 필드로 변경)
  const handleEdit = (todo) => {
    setEditingTodo(todo.id);
    setUpdatedContent(todo.content);
  };

  // 수정 완료 (저장 버튼 클릭 또는 Enter 입력 시)
  const handleUpdate = async (todoId) => {
    if (!updatedContent.trim()) {
      setEditingTodo(null);
      return;
    }

    try {
      await onUpdateTodo(todoId, dateStr, updatedContent);
      setEditingTodo(null);
    } catch (error) {
      console.error("🚨 할 일 수정 실패:", error);
    }
  };

  // 수정 취소 (ESC 키 또는 취소 버튼 클릭 시)
  const handleCancel = () => {
    setEditingTodo(null);
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
                onChange={() => onToggleTodo(todo.id, dateStr)}
              />
              
              {editingTodo === todo.id ? (
                <input
                  type="text"
                  value={updatedContent}
                  onChange={(e) => setUpdatedContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUpdate(todo.id); // ✅ Enter 키로 저장
                    if (e.key === "Escape") handleCancel(); // ✅ ESC 키로 취소
                  }}
                  autoFocus
                />
              ) : (
                <span>{todo.content}</span>
              )}

              {editingTodo === todo.id ? (
                <>
                  <button onClick={() => handleUpdate(todo.id)}>저장</button> {/* ✅ 저장 버튼 클릭 시 업데이트 */}
                  <button onClick={handleCancel}>취소</button>
                </>
              ) : (
                <button onClick={() => handleEdit(todo)}>수정</button>
              )}

              <button onClick={() => onDeleteTodo(todo.id, dateStr)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;