package com.example.calander.todo.dto;

import lombok.Builder;

@Builder
public record CalendarStatsResponse(
        Long totalCount,
        Long completedCount,
        Long inProgressCount,
        Double completionRate,
        Double inProgressRate
) {
}
