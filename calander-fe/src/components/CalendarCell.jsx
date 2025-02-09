import React from "react";

const CalendarCell = ({ date, dateStr, todosCount, onDateClick, selectedDate }) => {
  if (!date) {
    return <div className="empty-cell"></div>;
  }

  let cellClasses = "calendar-cell";
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0) cellClasses += " sunday";
  if (dayOfWeek === 6) cellClasses += " saturday";

  // ✅ 선택된 날짜와 일치하면 'selected' 클래스 추가
  if (dateStr === selectedDate) {
    cellClasses += " selected";
  }

  return (
    <div className={cellClasses} onClick={() => onDateClick(date)} style={{ cursor: "pointer" }}>
      <div className="date-number">{date.getDate()}</div>
      {todosCount > 0 && <div className="todo-count">{todosCount}</div>}
    </div>
  );
};

export default CalendarCell;