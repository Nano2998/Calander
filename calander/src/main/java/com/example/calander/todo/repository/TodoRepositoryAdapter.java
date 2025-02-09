package com.example.calander.todo.repository;

import com.example.calander.todo.entity.Todo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class TodoRepositoryAdapter implements TodoRepositoryPort{

    private final TodoRepository todoRepository;

    @Override
    public Todo save(Todo todo) {
        return todoRepository.save(todo);
    }

    @Override
    public Todo findById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow();
    }

    @Override
    public List<Todo> findByDate(String date) {
        return todoRepository.findByDate(date);
    }

    @Override
    public void delete(Todo todo) {
        todoRepository.delete(todo);
    }

    @Override
    public List<Todo> findTodosInRange(String startDate, String endDate) {
        return todoRepository.findTodosInRange(startDate, endDate);
    }
}
