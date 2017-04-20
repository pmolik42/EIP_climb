package com.climb.eip.climb.api.bodies;

/**
 * Created by Younes on 01/03/2017.
 */

public class LoginBody {
    private String email;
    private String password;

    public LoginBody(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
