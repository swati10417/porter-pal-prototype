package com.portersaathi.model;

import lombok.Data;

@Data
public class AssistantRequest {
    private String driverId;
    private String query;
    private String language = "hi";
}