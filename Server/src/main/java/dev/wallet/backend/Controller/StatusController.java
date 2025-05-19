package dev.wallet.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller for checking server status and connectivity.
 * This helps verify that the JavaScript client can connect to the backend.
 */
@RestController
@RequestMapping("/api/status")
public class StatusController {

    /**
     * Simple endpoint to check if the server is running and accessible from the client.
     * @return Server status information
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "operational");
        status.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        status.put("version", "1.0.0");
        return ResponseEntity.ok(status);
    }
}
