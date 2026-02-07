package com.sadwiik.taskplatform.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class LocalDateTimeDeserializer extends StdDeserializer<LocalDateTime> {
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;
    
    public LocalDateTimeDeserializer() {
        super(LocalDateTime.class);
    }

    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();

        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        value = value.trim(); // Trim whitespace

        // Check if value contains 'T' (datetime format indicator)
        if (value.contains("T")) {
            try {
                return LocalDateTime.parse(value, DATETIME_FORMATTER);
            } catch (Exception e) {
                // Fall through to date parsing
            }
        }

        // Try to parse as date-only format (YYYY-MM-DD)
        try {
            LocalDate date = LocalDate.parse(value, DATE_FORMATTER);
            return LocalDateTime.of(date, LocalTime.of(23, 59, 59)); // End of day
        } catch (Exception e) {
            throw new IOException("Could not parse date/datetime value '" + value + "'. Expected format: yyyy-MM-dd or yyyy-MM-dd'T'HH:mm:ss");
        }
    }
}

