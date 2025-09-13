package com.portersaathi.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    /**
     * WebSocket endpoint for real-time voice communication
     * @param message The incoming message
     * @return Processed response
     */
    @MessageMapping("/voice-command")
    @SendTo("/topic/voice-response")
    public String handleVoiceCommand(String message) {
        // In a real implementation, this would process voice commands
        // For now, we'll just echo the message
        return "Received: " + message;
    }

    /**
     * WebSocket endpoint for emergency alerts
     * @param alert The emergency alert
     * @return Confirmation message
     */
    @MessageMapping("/emergency-alert")
    @SendTo("/topic/emergency-notifications")
    public String handleEmergencyAlert(String alert) {
        // In a real implementation, this would process emergency alerts
        // For now, we'll just log and confirm
        System.out.println("Emergency alert received: " + alert);
        return "Emergency alert acknowledged: " + alert;
    }
}