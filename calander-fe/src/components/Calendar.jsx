import React from "react";
import CalendarCell from "./CalendarCell.jsx";

const Calendar = ({ currentDate, todos, onDateClick, getLocalDateString, selectedDate }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  const cells = [];
  for (let i = 0; i < startDay; i++) {
    cells.push(undefined);
  }
  for (let day = 1; day <= totalDays; day++) {
    const dateObj = new Date(year, month, day);
    cells.push(dateObj);
  }
  while (cells.length % 7 !== 0) {
    cells.push(undefined);
  }

  return (
    <div className="calendar-container">
      <h2>
        {year}년 {month + 1}월
      </h2>
      <div className="calendar-grid">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day} className="calendar-header-cell">
            {day}
          </div>
        ))}

        {cells.map((dateObj, index) => {
          if (!dateObj) {
            return <div key={index} className="empty-cell"></div>;
          }

          const dateStr = getLocalDateString(dateObj);
          const todosCount = todos[dateStr]?.length ?? 0;

          return (
            <CalendarCell
              key={index}
              date={dateObj}
              dateStr={dateStr}
              todosCount={todosCount}
              onDateClick={onDateClick}
              selectedDate={selectedDate} // ✅ 선택한 날짜 전달
            />
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;