package com.climb.eip.climb.api.models;


/**
 * Created by Younes on 01/03/2017.
 */

public class Session {
    private String token;

    private String email;
    private String password;

    public Session(String email, String password, String token) {
        this.email = email;
        this.password = password;
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
