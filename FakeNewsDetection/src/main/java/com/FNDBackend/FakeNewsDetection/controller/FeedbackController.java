package com.FNDBackend.FakeNewsDetection.controller;

import com.FNDBackend.FakeNewsDetection.dto.FeedBackRequestDTO;
import com.FNDBackend.FakeNewsDetection.dto.FeedBackResponseDTO;
import com.FNDBackend.FakeNewsDetection.dto.FeedBackStatsDTO;
import com.FNDBackend.FakeNewsDetection.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/feedbacks")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("/Update")
    public ResponseEntity<FeedBackResponseDTO> updateFeedback(@RequestBody FeedBackRequestDTO feedBackRequestDTO) {
        return ResponseEntity.ok(feedbackService.addOrUpdateFeedBack(feedBackRequestDTO));
    }

    @GetMapping("/stats/{mgId}")
    public ResponseEntity<FeedBackStatsDTO> stats(@PathVariable Long mgId) {
        FeedBackStatsDTO stats = feedbackService.getFeedBackStats(mgId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FeedBackResponseDTO>> getFeedBackByUser(@PathVariable Long userId) {
        List<FeedBackResponseDTO> feedBackResponseDTOS = feedbackService.getFeedBackByUser(userId);
        return ResponseEntity.ok(feedBackResponseDTOS);
    }

    @GetMapping("/message/{mgID}")
    public ResponseEntity<List<FeedBackResponseDTO>> getFeedBackByMessage(@PathVariable Long mgID) {
        List<FeedBackResponseDTO>  feedBackResponseDTOS = feedbackService.getFeedBackByMessage(mgID);
        return ResponseEntity.ok(feedBackResponseDTOS);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?>  deleteFeedBack(@PathVariable Long id){
        feedbackService.deleteFeedBack(id);
        return ResponseEntity.ok("FeedBack Deleted");
    }
}
