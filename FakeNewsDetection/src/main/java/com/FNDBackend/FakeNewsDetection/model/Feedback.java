package com.FNDBackend.FakeNewsDetection.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    //true = like , false = dislike
    private Boolean liked;

    @ManyToOne
    @JoinColumn(name = "message_id")
    private Message message;

    private LocalDate date;

    @PrePersist
    public void onCreate() {
        this.date = LocalDate.now();
    }
}
