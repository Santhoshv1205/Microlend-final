package com.microlend.client;

import com.microlend.dto.request.RegisterUserRequest;
import com.microlend.dto.response.ApiResponse;
import com.microlend.entity.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "user-service", path = "/api/admin/users")
public interface UserClient {

    @GetMapping("/email/{email}")
    ApiResponse<User> getUserByEmail(@PathVariable("email") String email);

    @PostMapping("/internal/register")
    ApiResponse<User> registerUserInternal(@RequestBody RegisterUserRequest request);

    @DeleteMapping("/{id}")
    ApiResponse<Void> deleteUser(@PathVariable("id") Long id);
}
