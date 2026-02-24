package com.FNDBackend.FakeNewsDetection.service;

import com.FNDBackend.FakeNewsDetection.JwtSecurity.JwtService;
import com.FNDBackend.FakeNewsDetection.dto.LoginRequestDto;
import com.FNDBackend.FakeNewsDetection.dto.UserRequestDTO;
import com.FNDBackend.FakeNewsDetection.dto.UserResponseDTO;
import com.FNDBackend.FakeNewsDetection.mapper.Converter;
import com.FNDBackend.FakeNewsDetection.model.User;
import com.FNDBackend.FakeNewsDetection.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public UserResponseDTO registerUser(UserRequestDTO userRequestDTO) {
        if (userRepository.findByEmail(userRequestDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(userRequestDTO.getEmail());
        user.setName(userRequestDTO.getName());
        user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        User saved = userRepository.save(user);

        // Generate JWT token for the new user
        String token = jwtService.generateToken(saved);

        UserResponseDTO response = Converter.convertRes(saved);
        response.setToken(token);
        return response;
    }

    public UserResponseDTO loginUser(LoginRequestDto loginRequestDto) {
        // Authenticate the user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getEmail(),
                        loginRequestDto.getPassword()
                )
        );

        User user = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate JWT token
        String token = jwtService.generateToken(user);

        UserResponseDTO response = Converter.convertRes(user);
        response.setToken(token);
        return response;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserResponseDTO getUser(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return Converter.convertRes(user.get());
        }
        throw new RuntimeException("User not found");
    }

    public boolean validatePassword(String password, String encodedPassword) {
        return passwordEncoder.matches(password, encodedPassword);
    }

    public Optional<User> findById(Long userID) {
        return userRepository.findById(userID);
    }
}
