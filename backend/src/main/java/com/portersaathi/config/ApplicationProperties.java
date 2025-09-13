package com.portersaathi.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "porter")
public class ApplicationProperties {
    private String defaultLanguage = "hi";
    private boolean voiceResponsesEnabled = true;
    private int emergencyResponseTimeout = 30; // seconds

    // Getters and setters
    public String getDefaultLanguage() {
        return defaultLanguage;
    }

    public void setDefaultLanguage(String defaultLanguage) {
        this.defaultLanguage = defaultLanguage;
    }

    public boolean isVoiceResponsesEnabled() {
        return voiceResponsesEnabled;
    }

    public void setVoiceResponsesEnabled(boolean voiceResponsesEnabled) {
        this.voiceResponsesEnabled = voiceResponsesEnabled;
    }

    public int getEmergencyResponseTimeout() {
        return emergencyResponseTimeout;
    }

    public void setEmergencyResponseTimeout(int emergencyResponseTimeout) {
        this.emergencyResponseTimeout = emergencyResponseTimeout;
    }
}