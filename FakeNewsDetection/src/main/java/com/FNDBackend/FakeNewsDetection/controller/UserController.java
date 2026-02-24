package com.FNDBackend.FakeNewsDetection.controller;

import com.FNDBackend.FakeNewsDetection.dto.LoginRequestDto;
import com.FNDBackend.FakeNewsDetection.dto.UserRequestDTO;
import com.FNDBackend.FakeNewsDetection.dto.UserResponseDTO;
import com.FNDBackend.FakeNewsDetection.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        UserResponseDTO userResponseDTO = userService.registerUser(userRequestDTO);
        return ResponseEntity.ok(userResponseDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> loginUser(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        UserResponseDTO userResponseDTO = userService.loginUser(loginRequestDto);
        return ResponseEntity.ok(userResponseDTO);
    }

    @GetMapping("/{email}")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUser(email));
    }

}
