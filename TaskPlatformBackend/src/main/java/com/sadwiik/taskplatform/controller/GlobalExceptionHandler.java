package com.sadwiik.taskplatform.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex, 
            WebRequest request) {
        
        Map<String, String> response = new HashMap<>();
        String message = ex.getMessage();
        
        if (message.contains("LocalDateTime")) {
            response.put("message", "Invalid date format. Please use YYYY-MM-DD for dates (e.g., 2026-01-31)");
        } else {
            response.put("message", "Invalid JSON format: " + message);
        }
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(
            RuntimeException ex, 
            WebRequest request) {
        
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
