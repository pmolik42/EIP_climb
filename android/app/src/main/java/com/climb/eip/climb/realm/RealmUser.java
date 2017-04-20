package com.climb.eip.climb.realm;

import com.climb.eip.climb.api.models.User;

import io.realm.RealmObject;

/**
 * Created by Younes on 16/04/2017.
 */

public class RealmUser extends RealmObject {

    private String email;
    private String username;
    private String password;
    private String token;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
