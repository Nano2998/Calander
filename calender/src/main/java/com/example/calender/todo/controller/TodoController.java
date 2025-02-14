package com.example.calender.todo.controller;

import com.example.calender.todo.dto.CalendarStatsResponse;
import com.example.calender.todo.dto.TodoRequest;
import com.example.calender.todo.dto.TodoResponse;
import com.example.calender.todo.dto.TodoUpdateRequest;
import com.example.calender.todo.service.TodoService;
import com.example.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Todo controller api", description = "Todo API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/todo")
public class TodoController {

    private final TodoService todoService;

    @Operation(summary = "Todo 조회")
    @GetMapping("")
    public ResponseEntity<ApiResponse<List<TodoResponse>>> getTodo(
            @RequestParam String date) {
        return ResponseEntity.ok()
                .body(ApiResponse.ok(todoService.getTodo(date)));
    }

    @Operation(summary = "Todo 수정")
    @PatchMapping("/{todoId}")
    public ResponseEntity<ApiResponse<TodoResponse>> modifiedTodo(
            @PathVariable Long todoId,
            @RequestBody TodoRequest todoRequest
    ) {
        return ResponseEntity.ok()
                .body(ApiResponse.ok(todoService.modifiedTodo(todoId, todoRequest)));
    }

    @Operation(summary = "Todo 완료")
    @PatchMapping("/{todoId}/toggle")
    public ResponseEntity<ApiResponse<TodoResponse>> updateTodo(
            @PathVariable Long todoId,
            @RequestBody TodoUpdateRequest updateRequest
            ) {
        return ResponseEntity.ok()
                .body(ApiResponse.ok(todoService.updateTodo(todoId, updateRequest.isCompleted())));
    }


    @Operation(summary = "Todo 생성")
    @PostMapping("")
    public ResponseEntity<ApiResponse<TodoResponse>> createTodo(
            @RequestBody TodoRequest todoRequest) {
        return ResponseEntity.ok()
                .body(ApiResponse.ok(todoService.createTodo(todoRequest)));
    }

    @Operation(summary = "Todo 삭제")
    @DeleteMapping("/{todoId}")
    public ResponseEntity<ApiResponse<Void>> deleteTodo(@PathVariable Long todoId) {
        todoService.deleteTodo(todoId);

        return ResponseEntity.ok().body(ApiResponse.ok());
    }

    @Operation(summary = "한달 일정조회")
    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<List<TodoResponse>>> getMonthlyTodos(
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        return ResponseEntity.ok()
                .body(ApiResponse.ok(todoService.getTodosInRange(startDate, endDate)));
    }

    @Operation(summary = "주간/월간 일정 통계 조회")
    @GetMapping("/calendar/stats")
    public ResponseEntity<ApiResponse<CalendarStatsResponse>> getCalendarStats(
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        return ResponseEntity.ok()
                .body(ApiResponse.ok(todoService.getCalendarStats(startDate, endDate)));
    }
}
