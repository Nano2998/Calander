import React from "react";
import CalendarCell from "./CalendarCell.jsx";

const Calendar = ({ currentDate, todos, onDateClick, getLocalDateString, selectedDate }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 이번 달의 첫 날과 시작 요일 (0: 일요일 ~ 6: 토요일)
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();

  // 이번 달의 총 일수
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  // 달력 그리드에 들어갈 셀들을 구성 (빈 셀 포함)
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
      <h2>{year}년 {month + 1}월</h2>
      <div className="calendar-grid">
        {/* 요일 헤더 */}
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day} className="calendar-header-cell">{day}</div>
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