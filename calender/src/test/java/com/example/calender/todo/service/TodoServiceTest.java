package com.example.calender.todo.service;

import com.example.calender.todo.dto.CalendarStatsResponse;
import com.example.calender.todo.dto.TodoRequest;
import com.example.calender.todo.dto.TodoResponse;
import com.example.calender.todo.entity.Todo;
import com.example.calender.todo.repository.TodoRepositoryPort;
import com.example.common.GlobalException;
import com.example.common.exception.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Todo 서비스 테스트")
class TodoServiceTest {

    @InjectMocks
    TodoService todoService;

    @Mock
    TodoRepositoryPort todoRepositoryPort;

    @Test
    @DisplayName("Todo 생성 - 성공 ")
    void createTodo() {
        // Given
        TodoRequest todoRequest = new TodoRequest(1L, "2025-01-02", "테스트");
        Todo todo = todoRequest.toEntity();

        when(todoRepositoryPort.save(any(Todo.class))).thenReturn(todo);

        // When
        TodoResponse todoResponse = todoService.createTodo(todoRequest);

        // Then
        assertEquals(todo.getId(), todoResponse.id());
        assertEquals(todo.getContent(), todoResponse.content());
        assertEquals(todo.getDate(), todoResponse.date());
        assertFalse(todoResponse.completed());
    }

    @Test
    @DisplayName("Todo 생성 - 내용이 null인 경우 예외 발생")
    void createTodo_nullContent() {
        // Given
        TodoRequest todoRequest = new TodoRequest(1L, "2025-01-02", "테스트");
        Todo todo = todoRequest.toEntity();

        when(todoRepositoryPort.save(any(Todo.class))).thenReturn(todo);

        // When, Then
        GlobalException.BadRequestException exception = assertThrows(
                GlobalException.BadRequestException.class,
                () -> todoService.createTodo(todoRequest)
        );
        assertEquals(ErrorCode.NOT_BLANK_CONTENT, exception.getErrorCode());
    }

    @Test
    @DisplayName("Todo 삭제")
    void deleteTodo() {
        // Given
        Long todoId = 1L;
        Todo todo = getTodo(todoId);
        when(todoRepositoryPort.findById(todoId)).thenReturn(todo);

        // When
        todoService.deleteTodo(todoId);

        // Then
        verify(todoRepositoryPort, times(1)).findById(todoId);
        verify(todoRepositoryPort, times(1)).delete(todo);
    }



    @Test
    @DisplayName("특정 날짜의 Todo 조회")
    void getTodo() {
        // Given
        String date = "2025-01-02";
        Todo todo = getTodo(1L);
        Todo todo2 = getTodo(2L);

        when(todoRepositoryPort.findByDate(date)).thenReturn(List.of(todo, todo2));

        // When
        List<TodoResponse> responses = todoService.getTodo(date);

        // Then
        assertEquals(2, responses.size());
        TodoResponse response1 = responses.get(0);
        assertEquals(todo.getId(), response1.id());
        assertEquals(todo.getContent(), response1.content());
        assertEquals(todo.getDate(), response1.date());
        assertEquals(todo.isCompleted(), response1.completed());

        TodoResponse response2 = responses.get(1);
        assertEquals(todo2.getId(), response2.id());
        assertEquals(todo2.getContent(), response2.content());
        assertEquals(todo2.getDate(), response2.date());
        assertEquals(todo2.isCompleted(), response2.completed());
    }

    @Test
    @DisplayName("Todo 수정")
    void modifiedTodo() {
        // Given
        Long todoId = 1L;
        String newContent = "수정된 내용";
        String newDate = "2025-01-03";
        TodoRequest todoRequest = new TodoRequest(todoId, newDate, newContent);
        Todo existingTodo = Todo.builder()
                .id(todoId)
                .content("이전 내용")
                .date("2025-01-02")
                .completed(false)
                .build();
        when(todoRepositoryPort.findById(todoId)).thenReturn(existingTodo);
        when(todoRepositoryPort.save(existingTodo)).thenReturn(existingTodo);

        // When
        TodoResponse response = todoService.modifiedTodo(todoId, todoRequest);

        // Then
        assertEquals(todoId, response.id());
        assertEquals(newContent, response.content());
        assertEquals(newDate, response.date());
    }

    @Test
    @DisplayName("Todo 완료 토글")
    void updateTodo() {
        // Given
        Long todoId = 1L;
        Todo todo = getTodo(todoId);
        when(todoRepositoryPort.findById(todoId)).thenReturn(todo);
        when(todoRepositoryPort.save(todo)).thenReturn(todo);

        // When
        TodoResponse response = todoService.updateTodo(todoId, true);

        // Then
        assertEquals(todoId, response.id());
        assertEquals("테스트", response.content());
        assertEquals("2025-01-02", response.date());
        assertTrue(response.completed());
    }

    @Test
    @DisplayName("범위 내 Todo 조회")
    void getTodosInRange() {
        // Given
        String startDate = "2025-01-01";
        String endDate = "2025-01-31";
        Todo todo1 = Todo.builder()
                .id(1L)
                .content("테스트1")
                .date("2025-01-10")
                .completed(false)
                .build();
        Todo todo2 = Todo.builder()
                .id(2L)
                .content("테스트2")
                .date("2025-01-20")
                .completed(true)
                .build();
        when(todoRepositoryPort.findTodosInRange(startDate, endDate))
                .thenReturn(List.of(todo1, todo2));

        // When
        List<TodoResponse> responses = todoService.getTodosInRange(startDate, endDate);

        // Then
        assertEquals(2, responses.size());
        TodoResponse response1 = responses.get(0);
        assertEquals(todo1.getId(), response1.id());
        assertEquals(todo1.getContent(), response1.content());
        assertEquals(todo1.getDate(), response1.date());
        assertEquals(todo1.isCompleted(), response1.completed());

        TodoResponse response2 = responses.get(1);
        assertEquals(todo2.getId(), response2.id());
        assertEquals(todo2.getContent(), response2.content());
        assertEquals(todo2.getDate(), response2.date());
        assertEquals(todo2.isCompleted(), response2.completed());
    }

    @Test
    @DisplayName("Todo 통계 조회")
    void getCalendarStats() {
        // Given
        String startDate = "2025-01-01";
        String endDate = "2025-01-31";
        Todo todo1 = Todo.builder()
                .id(1L)
                .content("테스트1")
                .date("2025-01-10")
                .completed(true)
                .build();
        Todo todo2 = Todo.builder()
                .id(2L)
                .content("테스트2")
                .date("2025-01-20")
                .completed(false)
                .build();
        Todo todo3 = Todo.builder()
                .id(3L)
                .content("테스트3")
                .date("2025-01-25")
                .completed(false)
                .build();

        when(todoRepositoryPort.findTodosInRange(startDate, endDate))
                .thenReturn(List.of(todo1, todo2, todo3));

        // When
        CalendarStatsResponse statsResponse = todoService.getCalendarStats(startDate, endDate);

        // Then
        assertEquals(3, statsResponse.totalCount());
        assertEquals(1, statsResponse.completedCount());
        assertEquals(2, statsResponse.inProgressCount());
        assertEquals(33.33, statsResponse.completionRate(), 0.1);
        assertEquals(66.66, statsResponse.inProgressRate(), 0.1);
    }

    // Todo 생성
    private static Todo getTodo(Long todoId) {
        Todo todo = Todo.builder()
                .id(todoId)
                .content("테스트" + todoId)
                .date("2025-01-02")
                .completed(false)
                .build();
        return todo;
    }
}