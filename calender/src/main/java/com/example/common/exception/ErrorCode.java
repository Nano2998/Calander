package com.example.common.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public enum ErrorCode {
    // Common
    NOT_BLANK_CONTENT(400, "T001" ,"일정이 비어있습니다." ),
    NOT_BLANK_DATE(400, "T002","날짜가 비어있습니다." );

    private final Integer status;
    private final String code;
    private final String message;
}
