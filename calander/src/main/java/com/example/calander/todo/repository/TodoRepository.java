package com.example.calander.todo.repository;

import com.example.calander.todo.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Arrays;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByDate(String date);

    @Query("SELECT t FROM Todo t WHERE t.date BETWEEN :startDate AND :endDate")
    List<Todo> findTodosInRange(String startDate, String endDate);
}
