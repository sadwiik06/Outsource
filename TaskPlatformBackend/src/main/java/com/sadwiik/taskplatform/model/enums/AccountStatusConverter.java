package com.sadwiik.taskplatform.model.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AccountStatusConverter implements AttributeConverter<AccountStatus, String> {

    @Override
    public String convertToDatabaseColumn(AccountStatus attribute) {
        if (attribute == null) {
            return AccountStatus.OPEN.name();
        }
        return attribute.name();
    }

    @Override
    public AccountStatus convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return AccountStatus.OPEN; // Default for empty/null legacy data
        }
        try {
            return AccountStatus.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Handle legacy "SUSPENDED" strings
            if (dbData.equalsIgnoreCase("SUSPENDED")) {
                return AccountStatus.CLOSED;
            }
            // Default fallback for any other unrecognized string
            return AccountStatus.OPEN;
        }
    }
}
