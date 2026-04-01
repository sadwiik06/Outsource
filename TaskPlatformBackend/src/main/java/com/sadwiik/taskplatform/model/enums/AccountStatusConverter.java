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
        
        if (attribute == AccountStatus.SUSPENDED) {
            return "CLOSED";
        }
        return attribute.name();
    }

    @Override
    public AccountStatus convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return AccountStatus.OPEN; 
        }
        try {
            String statusStr = dbData.toUpperCase();
            
            if (statusStr.equals("CLOSED")) {
                return AccountStatus.SUSPENDED;
            }
            return AccountStatus.valueOf(statusStr);
        } catch (IllegalArgumentException e) {
            
            return AccountStatus.OPEN;
        }
    }
}
