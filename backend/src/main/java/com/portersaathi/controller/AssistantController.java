package com.portersaathi.controller;

import com.portersaathi.model.AssistantRequest;
import com.portersaathi.model.AssistantResponse;
import com.portersaathi.model.Driver;
import com.portersaathi.service.AssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AssistantController {

    @Autowired
    private AssistantService assistantService;

    /**
     * Endpoint to process user queries
     * @param request The AssistantRequest containing driverId and query
     * @return AssistantResponse with the processed response
     */
    @PostMapping("/query")
    public ResponseEntity<AssistantResponse> processQuery(@RequestBody AssistantRequest request) {
        try {
            AssistantResponse response = assistantService.processQuery(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Log the error and return a user-friendly error response
            AssistantResponse errorResponse = new AssistantResponse();
            errorResponse.setResponse("Sorry, I'm having trouble processing your request. Please try again.");
            errorResponse.setType("text");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Endpoint to get driver information
     * @param id The driver ID
     * @return Driver object with the driver's information
     */
    @GetMapping("/driver/{id}")
    public ResponseEntity<Driver> getDriver(@PathVariable String id) {
        try {
            Driver driver = assistantService.getDriver(id);
            if (driver != null) {
                return ResponseEntity.ok(driver);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Endpoint to trigger emergency assistance
     * @param driverId The driver ID
     * @return AssistantResponse with emergency information
     */
    @PostMapping("/emergency/{driverId}")
    public ResponseEntity<AssistantResponse> triggerEmergency(@PathVariable String driverId) {
        try {
            AssistantRequest request = new AssistantRequest();
            request.setDriverId(driverId);
            request.setQuery("emergency help needed");

            AssistantResponse response = assistantService.processQuery(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Log the error and return a user-friendly error response
            AssistantResponse errorResponse = new AssistantResponse();
            errorResponse.setResponse("Emergency alert failed. Please try again or call directly.");
            errorResponse.setType("text");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Health check endpoint
     * @return Simple status message
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Porter Saathi API is running");
    }

    /**
     * Endpoint to get available voice commands
     * @return List of available voice commands
     */
    @GetMapping("/commands")
    public ResponseEntity<String[]> getAvailableCommands() {
        String[] commands = {
                "Aaj ka kharcha kaat ke kitna kamaya?",
                "Mera business pichle hafte se behtar hai ya nahi?",
                "Kya mujhe koi penalty lagi hai?",
                "Challan kaise contest karein?",
                "DigiLocker par documents kaise upload karein?",
                "Sahayata chahiye"
        };
        return ResponseEntity.ok(commands);
    }
}