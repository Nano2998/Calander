package com.example.calender.todo.repository;

import com.example.calender.todo.entity.Todo;

import java.util.List;

public interface TodoRepositoryPort {
    Todo save(Todo todo);

    Todo findById(Long todoId);

    List<Todo> findByDate(String date);

    void delete(Todo todo);

    List<Todo> findTodosInRange(String startDate, String endDate);
}
