package com.example.common;

import com.example.common.response.ErrorResponse;
import jakarta.annotation.Priority;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Priority(Integer.MAX_VALUE)
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(GlobalException.NotFoundException.class)
    public ErrorResponse<?> handleNotFoundException(GlobalException.NotFoundException e) {
        return ErrorResponse.of(e.getErrorCode());
    }

    @ExceptionHandler(GlobalException.InternalServerException.class)
    public ErrorResponse<?> handleInternalServerException(GlobalException.InternalServerException e) {
        return ErrorResponse.of(e.getErrorCode());
    }

    @ExceptionHandler(GlobalException.IllegalStateException.class)
    public ErrorResponse<?> handleIllegalStateException(GlobalException.IllegalStateException e) {
        return ErrorResponse.of(e.getErrorCode());
    }

    @ExceptionHandler(GlobalException.BadRequestException.class)
    public ErrorResponse<?> handleBadRequestException(GlobalException.BadRequestException e) {
        return ErrorResponse.of(e.getErrorCode());
    }
}
