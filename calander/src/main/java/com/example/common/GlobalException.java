package com.example.common;

import com.example.common.exception.BaseException;
import com.example.common.exception.ErrorCode;

public abstract class GlobalException extends BaseException {
    protected GlobalException(ErrorCode errorCode) {
        super(errorCode);
    }

    public static class NotFoundException extends GlobalException {
        public NotFoundException(ErrorCode errorCode) {
            super(errorCode);
        }
    }

    public static class InternalServerException extends GlobalException {
        public InternalServerException(ErrorCode errorCode) {
            super(errorCode);
        }
    }

    public static class IllegalStateException extends GlobalException {
        public IllegalStateException(ErrorCode errorCode) {
            super(errorCode);
        }
    }

    public static class BadRequestException extends GlobalException {
        public BadRequestException(ErrorCode errorCode) {
            super(errorCode);
        }
    }

}
