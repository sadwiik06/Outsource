package com.sadwiik.taskplatform.model;

import jakarta.persistence.*;
import lombok.*;
import com.sadwiik.taskplatform.model.enums.AccountStatus;
import com.sadwiik.taskplatform.model.enums.AccountStatusConverter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private Double balance = 0.0;

    @Convert(converter = AccountStatusConverter.class)
    @Column(nullable = false)
    private AccountStatus status = AccountStatus.OPEN;

    private String name;
    
    @Column(length = 500)
    private String skills;
}
