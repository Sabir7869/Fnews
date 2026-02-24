package com.FNDBackend.FakeNewsDetection.repository;

import com.FNDBackend.FakeNewsDetection.model.Message;
import com.FNDBackend.FakeNewsDetection.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message,Long> {

    Optional<Message> findByContentAndAuthor(String content, User user);
}
