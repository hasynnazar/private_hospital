package com.example.demo.controller;

import com.example.demo.DTO.AiChatRequest;
import com.example.demo.DTO.AiChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AiAssistantController {

    private final RestClient restClient;
    private final String n8nWebhookUrl;

    public AiAssistantController(@Value("${app.n8n.webhook-url:http://127.0.0.1:5678/webhook/0NX6wcUmsku8K9FZ/webhook/medical-assistant}") String n8nWebhookUrl) {
        this.n8nWebhookUrl = n8nWebhookUrl;
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(java.time.Duration.ofSeconds(10));
        factory.setReadTimeout(java.time.Duration.ofSeconds(60));
        this.restClient = RestClient.builder().requestFactory(factory).build();
    }

    @PostMapping("/chat")
    public AiChatResponse chat(@RequestBody AiChatRequest request) {
        if (request.message() == null || request.message().isBlank()) {
            throw new IllegalArgumentException("Wiadomość nie może być pusta");
        }

        String sessionId = request.sessionId() != null && !request.sessionId().isBlank()
                ? request.sessionId()
                : UUID.randomUUID().toString();

        try {
            Map<?, ?> response = restClient.post()
                    .uri(n8nWebhookUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("message", request.message(), "sessionId", sessionId))
                    .retrieve()
                    .body(Map.class);

            String reply = response != null && response.get("reply") != null
                    ? response.get("reply").toString()
                    : "Przepraszam, nie udało się wygenerować odpowiedzi.";

            return new AiChatResponse(reply, sessionId);
        } catch (Exception e) {
            return new AiChatResponse(
                    "Przepraszam, asystent AI jest chwilowo niedostępny (" + e.getMessage() + "). " +
                    "W celu umówienia wizyty zapraszamy do skorzystania z katalogu 'Specjaliści' lub kontaktu telefonicznego.",
                    sessionId
            );
        }
    }
}
