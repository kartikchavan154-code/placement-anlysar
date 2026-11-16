package com.campusplacement.service;

import com.campusplacement.dto.AuthRequest;
import com.campusplacement.dto.AuthResponse;
import com.campusplacement.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(AuthRequest loginRequest);
    AuthResponse register(RegisterRequest registerRequest);
}

