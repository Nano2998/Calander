package com.example.calender.todo.dto;

import com.example.calender.todo.entity.Todo;
import lombok.Builder;

public record TodoUpdateRequest(
        Long id,
        String date,
        String content,
        boolean isCompleted
) {
    @Builder
    public Todo toEntity() {
        return Todo.builder()
                .date(date)
                .content(content)
                .completed(isCompleted)
                .build();
    }
}
