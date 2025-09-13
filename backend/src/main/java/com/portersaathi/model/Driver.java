package com.portersaathi.model;

import lombok.Data;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Data
public class Driver {
    private String id;
    private String name;
    private String phone;
    private String languagePreference = "hi"; // Default to Hindi
    private Map<LocalDate, DailyEarnings> earnings = new HashMap<>();
    private Vehicle vehicle;
    private EmergencyContact emergencyContact;
}