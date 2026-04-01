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
        // Map SUSPENDED to CLOSED for database compatibility
        if (attribute == AccountStatus.SUSPENDED) {
            return "CLOSED";
        }
        return attribute.name();
    }

    @Override
    public AccountStatus convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return AccountStatus.OPEN; // Default for empty/null legacy data
        }
        try {
            String statusStr = dbData.toUpperCase();
            // Map CLOSED from database back to SUSPENDED for app use
            if (statusStr.equals("CLOSED")) {
                return AccountStatus.SUSPENDED;
            }
            return AccountStatus.valueOf(statusStr);
        } catch (IllegalArgumentException e) {
            // Default fallback for any unrecognized string
            return AccountStatus.OPEN;
        }
    }
}
