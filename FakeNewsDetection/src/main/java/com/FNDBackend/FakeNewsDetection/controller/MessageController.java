
package com.FNDBackend.FakeNewsDetection.controller;


import com.FNDBackend.FakeNewsDetection.dto.MessageRequestDTO;
import com.FNDBackend.FakeNewsDetection.dto.MessageRespDto;
import com.FNDBackend.FakeNewsDetection.model.Message;
import com.FNDBackend.FakeNewsDetection.model.User;
import com.FNDBackend.FakeNewsDetection.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // Verify or fetch message
    @PostMapping("/verify")
    public ResponseEntity<MessageRespDto> verifyMessage(
            @RequestBody MessageRequestDTO request) {

        MessageRespDto response =
                messageService.processMessage(
                        request.getContent(),
                        request.getUserId()
                );

        return ResponseEntity.ok(response);
    }

    // Get message by ID
    @GetMapping("/{id}")
    public ResponseEntity<MessageRespDto> getMessage(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                messageService.getMessage(id)
        );
    }

    // Delete message
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMessage(
            @PathVariable Long id) {

        messageService.deleteMessage(id);
        return ResponseEntity.ok("Message deleted successfully");
    }

    // Get dynamic confidence
    @GetMapping("/{id}/confidence")
    public ResponseEntity<Double> getConfidence(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                messageService.calculateConfidence(id)
        );
    }
}
