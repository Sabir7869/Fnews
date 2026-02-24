package com.FNDBackend.FakeNewsDetection.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "messages")
@Data
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String content;


    private String verdict;

    // 0 - 100
    private Integer confidence;


    @Column(columnDefinition = "TEXT")
    private String summary;


    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    @Column(updatable = false)
    private LocalDate createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDate.now();
    }
}
