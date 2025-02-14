package com.example.calender.todo.dto;

import com.example.calender.todo.entity.Todo;
import lombok.Builder;

public record TodoRequest(
        Long id,
        String date,
        String content
) {

    @Builder
    public Todo toEntity() {
        return Todo.builder()
                .date(date)
                .content(content)
                .build();
    }


}
