package com.climb.eip.climb.api.models;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Date;

/**
 * Created by Younes on 25/03/2017.
 */

public class User {

    private String id;
    private String email;
    private String password;
    private String username;
    private String firstName;
    private String lastName;
    private String bio;
    private String pictureUrl;
    private Date createdAt;
    private Date updatedAt;

    public User(JSONObject userObject) throws JSONException {
        this.id = userObject.getString("_id");
        this.email = userObject.getJSONObject("local").getString("email");
        this.password = userObject.getJSONObject("local").getString("password");
        this.username = userObject.getJSONObject("profile").getString("username");
        this.firstName = userObject.getJSONObject("profile").getString("firstName");
        this.lastName = userObject.getJSONObject("profile").getString("lastName");
        this.bio = userObject.getJSONObject("profile").getString("bio");
        this.pictureUrl = userObject.getJSONObject("profile").getString("pictureUrl");

    }

    public String getId() {
        return id;
    }

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

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getPassword() {
        return password;
    }
}
