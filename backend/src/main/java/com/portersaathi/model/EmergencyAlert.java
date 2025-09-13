package com.portersaathi.model;

import lombok.Data;

@Data
public class EmergencyAlert {
    private String driverId;
    private String location;
    private String emergencyType;
    private String timestamp;
}