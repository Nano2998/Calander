package com.example.calander.todo.service;

import com.example.calander.todo.dto.CalendarStatsResponse;
import com.example.calander.todo.dto.TodoRequest;
import com.example.calander.todo.dto.TodoResponse;
import com.example.calander.todo.entity.Todo;
import com.example.calander.todo.repository.TodoRepositoryPort;
import com.example.common.GlobalException;
import com.example.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepositoryPort todoRepositoryPort;


    /**
     * Todo 만들기
     * @param todoRequest
     * @return
     */
    public TodoResponse createTodo(TodoRequest todoRequest) {
        String date = todoRequest.date();
        String title = todoRequest.content();

        if (title == null){
            throw new GlobalException.BadRequestException(ErrorCode.NOT_BLANK_CONTENT);
        }

        if (date == null) {
            throw new GlobalException.BadRequestException(ErrorCode.NOT_BLANK_DATE);
        }

        Todo todo = todoRequest.toEntity();
        todoRepositoryPort.save(todo);

        return TodoResponse.builder()
                .id(todo.getId())
                .content(todo.getContent())
                .date(todo.getDate())
                .build();
    }

    /**
     * Todo 삭제
     * @param todoId
     */
    public void deleteTodo(Long todoId) {
        Todo todo = todoRepositoryPort.findById(todoId);

        todoRepositoryPort.delete(todo);
    }

    /**
     * Todo 가져오기
     * @param date
     * @return
     */
    public List<TodoResponse> getTodo(String date) {
        List<Todo> todoList = todoRepositoryPort.findByDate(date);
        return todoList.stream()
                .map(todo -> TodoResponse.builder()
                        .id(todo.getId())
                        .content(todo.getContent())
                        .date(todo.getDate())
                        .completed(todo.isCompleted())
                        .build())
                .toList();
    }

    /**
     * Todo 수정
     * @param todoId
     * @param todoRequest
     * @return
     */
    public TodoResponse modifiedTodo(Long todoId, TodoRequest todoRequest) {
        Todo todo = todoRepositoryPort.findById(todoId);

        String content = todoRequest.content();
        String date = todoRequest.date();

        todo.updateTodo(content,date);
        todoRepositoryPort.save(todo);

        return TodoResponse.builder()
                .id(todo.getId())
                .content(content)
                .date(date)
                .build();
    }

    /**
     * Todo 완료
     * @param todoId
     * @param isCompleted
     * @return
     */
    public TodoResponse updateTodo(Long todoId, boolean isCompleted) {
        Todo todo = todoRepositoryPort.findById(todoId);
        todo.toggleCompleted();
        todoRepositoryPort.save(todo);

        return TodoResponse.builder()
                .id(todo.getId())
                .content(todo.getContent())
                .date(todo.getDate())
                .completed(isCompleted)
                .build();
    }

    public List<TodoResponse> getTodosInRange(String startDate, String endDate) {
        return todoRepositoryPort.findTodosInRange(startDate, endDate)
                .stream()
                .map(TodoResponse::fromEntity)
                .toList();
    }

    /**
     * Todo 통계
     * @param startDate
     * @param endDate
     * @return
     */
    public CalendarStatsResponse getCalendarStats(String startDate, String endDate) {
        List<Todo> todos = todoRepositoryPort.findTodosInRange(startDate, endDate);

        long totalCount = todos.size();
        long completedCount = todos.stream().filter(Todo::isCompleted).count();
        long inProgressCount = totalCount - completedCount;

        double completionRate = (totalCount == 0) ? 0 : (double) completedCount / totalCount * 100;
        double inProgressRate = (totalCount == 0) ? 0 : (double) inProgressCount / totalCount * 100;

        return CalendarStatsResponse.builder()
                .totalCount(totalCount)
                .completedCount(completedCount)
                .inProgressCount(inProgressCount)
                .completionRate(completionRate)
                .inProgressRate(inProgressRate)
                .build();
    }
}
