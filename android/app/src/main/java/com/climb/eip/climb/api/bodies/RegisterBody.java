package com.climb.eip.climb.api.bodies;

/**
 * Created by Younes on 01/03/2017.
 */

public class RegisterBody {

    private String email;
    private String username;
    private String password;
    private String confirmPassword;

    public RegisterBody(String email, String username, String password, String confirmPassword) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }
}
