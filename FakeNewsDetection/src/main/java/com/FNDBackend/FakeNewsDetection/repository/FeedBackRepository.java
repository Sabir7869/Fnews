package com.FNDBackend.FakeNewsDetection.repository;

import com.FNDBackend.FakeNewsDetection.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FeedBackRepository extends JpaRepository<Feedback,Long> {

    Optional<Feedback> findByUserIdAndMessageId(Long userID, Long messageId);

    Long countByMessageIdAndLiked(Long messageID, boolean b);


    List<Feedback> findByMessageId(Long messageID);

    List<Feedback> findByUserId(Long userID);
}
