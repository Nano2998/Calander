import React from "react";

const CalendarCell = ({ date, dateStr, todosCount, onDateClick, selectedDate }) => {
  if (!date) {
    return <div className="empty-cell"></div>;
  }

  let cellClasses = "calendar-cell";
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0) cellClasses += " sunday";
  if (dayOfWeek === 6) cellClasses += " saturday";

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