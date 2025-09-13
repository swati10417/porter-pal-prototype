package com.portersaathi.service;

import com.portersaathi.model.*;
import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.*;

@Service
public class AssistantService {

    // In-memory data storage (instead of database)
    private Map<String, Driver> drivers = new HashMap<>();
    private Map<String, List<String>> processGuides = new HashMap<>();
    private Map<String, String> commonQueries = new HashMap<>();

    @PostConstruct
    public void initData() {
        // Initialize with sample driver data
        initializeSampleDrivers();

        // Initialize process guides
        initializeProcessGuides();

        // Initialize common queries and responses
        initializeCommonQueries();
    }

    private void initializeSampleDrivers() {
        Driver driver = new Driver();
        driver.setId("driver123");
        driver.setName("Rajesh Kumar");
        driver.setPhone("9876543210");
        driver.setLanguagePreference("hi");

        Vehicle vehicle = new Vehicle();
        vehicle.setType("Tata Ace");
        vehicle.setNumber("MH01AB1234");
        vehicle.setInsuranceExpiry("2024-12-31");
        driver.setVehicle(vehicle);

        EmergencyContact contact = new EmergencyContact();
        contact.setName("Sunita Devi");
        contact.setPhone("9123456789");
        contact.setRelationship("Wife");
        driver.setEmergencyContact(contact);

        // Add sample earnings data
        LocalDate today = LocalDate.now();
        DailyEarnings todayEarnings = new DailyEarnings();
        todayEarnings.setTotalEarnings(2500);
        todayEarnings.setExpenses(500);
        todayEarnings.setNetEarnings(2000);
        todayEarnings.setCompletedTrips(8);
        todayEarnings.getPenalties().put("penalty1", "Late delivery by 30 minutes");
        todayEarnings.getRewards().put("reward1", "Customer appreciation bonus");

        driver.getEarnings().put(today, todayEarnings);

        // Add data for previous days
        LocalDate yesterday = today.minusDays(1);
        DailyEarnings yesterdayEarnings = new DailyEarnings();
        yesterdayEarnings.setTotalEarnings(2200);
        yesterdayEarnings.setExpenses(450);
        yesterdayEarnings.setNetEarnings(1750);
        yesterdayEarnings.setCompletedTrips(7);
        driver.getEarnings().put(yesterday, yesterdayEarnings);

        LocalDate lastWeek = today.minusDays(7);
        DailyEarnings lastWeekEarnings = new DailyEarnings();
        lastWeekEarnings.setTotalEarnings(2100);
        lastWeekEarnings.setExpenses(400);
        lastWeekEarnings.setNetEarnings(1700);
        lastWeekEarnings.setCompletedTrips(6);
        driver.getEarnings().put(lastWeek, lastWeekEarnings);

        drivers.put(driver.getId(), driver);

        // Add another sample driver
        Driver driver2 = new Driver();
        driver2.setId("driver456");
        driver2.setName("Mohan Singh");
        driver2.setPhone("8765432109");
        driver2.setLanguagePreference("hi");

        Vehicle vehicle2 = new Vehicle();
        vehicle2.setType("Mahindra Bolero");
        vehicle2.setNumber("DL02CD5678");
        vehicle2.setInsuranceExpiry("2024-10-15");
        driver2.setVehicle(vehicle2);

        EmergencyContact contact2 = new EmergencyContact();
        contact2.setName("Ramesh Singh");
        contact2.setPhone("8987654321");
        contact2.setRelationship("Brother");
        driver2.setEmergencyContact(contact2);

        drivers.put(driver2.getId(), driver2);
    }

    private void initializeProcessGuides() {
        processGuides.put("contest_challan", Arrays.asList(
                "Visit the traffic police website",
                "Click on 'Contest Challan' option",
                "Enter your vehicle number and challan number",
                "Upload necessary documents",
                "Submit your explanation",
                "Pay any required fees",
                "Track your application status"
        ));

        processGuides.put("digilocker_upload", Arrays.asList(
                "Open DigiLocker app or website",
                "Login with your mobile number",
                "Select 'Upload Documents'",
                "Choose document type",
                "Select file from your device",
                "Add description if needed",
                "Click 'Upload'"
        ));

        processGuides.put("apply_insurance", Arrays.asList(
                "Contact your insurance provider",
                "Provide vehicle details",
                "Submit required documents",
                "Choose insurance plan",
                "Make payment",
                "Receive policy documents"
        ));
    }

    private void initializeCommonQueries() {
        commonQueries.put("greeting", "Namaste! Main aapka Porter Saathi hoon. Aaj main aapki kya madad kar sakta hoon?");
        commonQueries.put("thanks", "Aapka swagat hai! Kya aapko koi aur madad chahiye?");
        commonQueries.put("help", "Main aapki madad earnings, penalties, challan, documents, aur emergency situations ke liye kar sakta hoon.");
    }

    public AssistantResponse processQuery(AssistantRequest request) {
        String query = request.getQuery().toLowerCase();
        Driver driver = drivers.get(request.getDriverId());
        AssistantResponse response = new AssistantResponse();

        if (driver == null) {
            response.setResponse("I couldn't find your driver profile. Please try again later.");
            response.setType("text");
            return response;
        }

        // Check for common queries first
        if (query.contains("namaste") || query.contains("hello") || query.contains("hi")) {
            response.setResponse(commonQueries.get("greeting"));
            response.setType("text");
            return response;
        }

        if (query.contains("thank") || query.contains("dhanyavad")) {
            response.setResponse(commonQueries.get("thanks"));
            response.setType("text");
            return response;
        }

        if (query.contains("help") || query.contains("madad")) {
            response.setResponse(commonQueries.get("help"));

            // Add suggestions for follow-up questions
            Map<String, String> suggestions = new HashMap<>();
            suggestions.put("earnings", "Aaj maine kitna kamaya?");
            suggestions.put("penalties", "Kya mujhe koi penalty lagi hai?");
            suggestions.put("challan", "Challan kaise contest karein?");
            suggestions.put("emergency", "Sahayata chahiye");

            response.setSuggestions(suggestions);
            response.setType("text");
            return response;
        }

        // Handle different types of queries
        if (query.contains("kamaya") || query.contains("earn") || query.contains("earning")) {
            return handleEarningsQuery(driver, query);
        } else if (query.contains("penalty") || query.contains("fine") || query.contains("dand")) {
            return handlePenaltyQuery(driver, query);
        } else if (query.contains("challan") || query.contains("ticket")) {
            return handleChallanQuery();
        } else if (query.contains("digilocker") || query.contains("document")) {
            return handleDigilockerQuery();
        } else if (query.contains("business") || query.contains("vyapar")) {
            return handleBusinessQuery(driver, query);
        } else if (query.contains("emergency") || query.contains("sahayata") || query.contains("help")) {
            return handleEmergencyQuery(driver);
        } else if (query.contains("insurance") || query.contains("bima")) {
            return handleInsuranceQuery();
        } else {
            response.setResponse("I'm not sure how to help with that. You can ask me about your earnings, penalties, or other assistance.");

            // Add suggestions for follow-up questions
            Map<String, String> suggestions = new HashMap<>();
            suggestions.put("earnings", "Aaj maine kitna kamaya?");
            suggestions.put("penalties", "Kya mujhe koi penalty lagi hai?");
            suggestions.put("emergency", "Sahayata chahiye");

            response.setSuggestions(suggestions);
            response.setType("text");
        }

        return response;
    }

    private AssistantResponse handleEarningsQuery(Driver driver, String query) {
        AssistantResponse response = new AssistantResponse();
        LocalDate today = LocalDate.now();
        DailyEarnings earnings = driver.getEarnings().get(today);

        if (earnings != null) {
            String responseText = String.format("Aaj aapne %d trip complete kiye aur ₹%.2f kamaye. " +
                            "Aapka kharcha ₹%.2f tha, isliye aapki net kamai hai ₹%.2f.",
                    earnings.getCompletedTrips(), earnings.getTotalEarnings(),
                    earnings.getExpenses(), earnings.getNetEarnings());

            response.setResponse(responseText);
        } else {
            response.setResponse("Aaj ke liye koi earning data uplabdh nahi hai.");
        }

        // Add suggestions for follow-up questions
        Map<String, String> suggestions = new HashMap<>();
        suggestions.put("penalties", "Kya mujhe koi penalty lagi hai?");
        suggestions.put("comparison", "Pichle hafte ke mukable aaj ka performance kaisa raha?");

        response.setSuggestions(suggestions);
        response.setType("text");
        return response;
    }

    private AssistantResponse handlePenaltyQuery(Driver driver, String query) {
        AssistantResponse response = new AssistantResponse();
        LocalDate today = LocalDate.now();
        DailyEarnings earnings = driver.getEarnings().get(today);

        if (earnings != null && !earnings.getPenalties().isEmpty()) {
            StringBuilder penaltyText = new StringBuilder("Aapko aaj " +
                    earnings.getPenalties().size() + " penalty laga hai: ");

            for (String reason : earnings.getPenalties().values()) {
                penaltyText.append(reason).append(". ");
            }

            response.setResponse(penaltyText.toString());
        } else {
            response.setResponse("Aapko aaj koi penalty nahi lagi hai. Badhai ho!");
        }

        response.setType("text");
        return response;
    }

    private AssistantResponse handleChallanQuery() {
        AssistantResponse response = new AssistantResponse();
        response.setResponse("Main aapko challan contest karne mein madad kar sakta hun. " +
                "Yeh ek step-by-step process hai:");

        // Add process steps as suggestions
        Map<String, String> suggestions = new HashMap<>();
        List<String> steps = processGuides.get("contest_challan");

        for (int i = 0; i < steps.size(); i++) {
            suggestions.put("step_" + (i+1), "Step " + (i+1) + ": " + steps.get(i));
        }

        response.setSuggestions(suggestions);
        response.setType("text");
        return response;
    }

    private AssistantResponse handleDigilockerQuery() {
        AssistantResponse response = new AssistantResponse();
        response.setResponse("Main aapko DigiLocker par documents upload karne mein madad kar sakta hun. " +
                "Yeh process kuch steps mein puri hogi:");

        // Add process steps as suggestions
        Map<String, String> suggestions = new HashMap<>();
        List<String> steps = processGuides.get("digilocker_upload");

        for (int i = 0; i < steps.size(); i++) {
            suggestions.put("step_" + (i+1), "Step " + (i+1) + ": " + steps.get(i));
        }

        response.setSuggestions(suggestions);
        response.setType("text");
        return response;
    }

    private AssistantResponse handleBusinessQuery(Driver driver, String query) {
        AssistantResponse response = new AssistantResponse();
        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(7);

        // Simple comparison logic
        DailyEarnings todayEarnings = driver.getEarnings().get(today);
        DailyEarnings weekAgoEarnings = driver.getEarnings().get(weekAgo);

        if (todayEarnings != null && weekAgoEarnings != null) {
            double growthPercent = ((todayEarnings.getNetEarnings() - weekAgoEarnings.getNetEarnings()) /
                    weekAgoEarnings.getNetEarnings()) * 100;

            String growthText = growthPercent >= 0 ?
                    String.format("%.2f percent behtar", growthPercent) :
                    String.format("%.2f percent kam", -growthPercent);

            response.setResponse(String.format("Aaj aapka business pichle hafte ke mukable %s raha. " +
                            "Aaj aapne ₹%.2f kamaye jabki pichle hafte us din ₹%.2f kamaye the.",
                    growthText, todayEarnings.getNetEarnings(), weekAgoEarnings.getNetEarnings()));
        } else {
            response.setResponse("Main business comparison ke liye paryaapt data nahi dhundh paaya.");
        }

        response.setType("text");
        return response;
    }

    private AssistantResponse handleEmergencyQuery(Driver driver) {
        AssistantResponse response = new AssistantResponse();
        String emergencyText = "Emergency alert bhej diya gaya hai. " +
                "Aapki location aur details emergency contacts ko bhej di gayi hain. " +
                "Kripya shant rahein aur madad ka intezar karein. " +
                "Aapki safety hamari priority hai.";

        response.setResponse(emergencyText);
        response.setType("text");

        // In a real implementation, we would trigger actual emergency protocols here
        System.out.println("EMERGENCY ALERT FOR DRIVER: " + driver.getName());
        if (driver.getEmergencyContact() != null) {
            System.out.println("CONTACTING: " + driver.getEmergencyContact().getName() +
                    " at " + driver.getEmergencyContact().getPhone());
        }

        return response;
    }

    private AssistantResponse handleInsuranceQuery() {
        AssistantResponse response = new AssistantResponse();
        response.setResponse("Main aapko vehicle insurance ke liye apply karne mein madad kar sakta hun. " +
                "Yeh process kuch steps mein puri hogi:");

        // Add process steps as suggestions
        Map<String, String> suggestions = new HashMap<>();
        List<String> steps = processGuides.get("apply_insurance");

        for (int i = 0; i < steps.size(); i++) {
            suggestions.put("step_" + (i+1), "Step " + (i+1) + ": " + steps.get(i));
        }

        response.setSuggestions(suggestions);
        response.setType("text");
        return response;
    }

    public Driver getDriver(String driverId) {
        return drivers.get(driverId);
    }

    // Additional method to add a new driver (for testing purposes)
    public void addDriver(Driver driver) {
        drivers.put(driver.getId(), driver);
    }

    // Method to update driver earnings (for testing purposes)
    public void updateDriverEarnings(String driverId, LocalDate date, DailyEarnings earnings) {
        Driver driver = drivers.get(driverId);
        if (driver != null) {
            driver.getEarnings().put(date, earnings);
        }
    }
}