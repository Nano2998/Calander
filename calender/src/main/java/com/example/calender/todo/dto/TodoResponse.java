package com.example.calender.todo.dto;

import com.example.calender.todo.entity.Todo;
import lombok.Builder;

@Builder
public record TodoResponse(
        Long id,
        String content,
        String date,
        boolean completed
) {
    public static TodoResponse fromEntity(Todo todo) {
        return TodoResponse.builder()
                .id(todo.getId())
                .content(todo.getContent())
                .date(todo.getDate())
                .completed(todo.isCompleted())
                .build();
    }
}
