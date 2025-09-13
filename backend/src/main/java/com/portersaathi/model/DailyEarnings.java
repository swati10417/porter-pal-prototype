package com.portersaathi.model;

import lombok.Data;
import java.util.HashMap;
import java.util.Map;

@Data
public class DailyEarnings {
    private double totalEarnings;
    private double expenses;
    private double netEarnings;
    private int completedTrips;
    private Map<String, String> penalties = new HashMap<>(); // penaltyId -> reason
    private Map<String, String> rewards = new HashMap<>(); // rewardId -> reason
}