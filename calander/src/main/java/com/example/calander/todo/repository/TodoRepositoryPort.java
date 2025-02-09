package com.example.calander.todo.repository;

import com.example.calander.todo.entity.Todo;
import org.springframework.data.jpa.repository.Query;

import java.util.Arrays;
import java.util.List;

public interface TodoRepositoryPort {
    Todo save(Todo todo);

    Todo findById(Long todoId);

    List<Todo> findByDate(String date);

    void delete(Todo todo);

    List<Todo> findTodosInRange(String startDate, String endDate);
}
