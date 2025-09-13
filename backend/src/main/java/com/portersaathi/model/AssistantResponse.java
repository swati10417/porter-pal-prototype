package com.portersaathi.model;

import lombok.Data;
import java.util.HashMap;
import java.util.Map;

@Data
public class AssistantResponse {
    private String response;
    private String type; // "text" or "audio"
    private String audioUrl; // URL to generated audio file if type is audio
    private Map<String, String> suggestions = new HashMap<>(); // Suggested follow-up questions
}