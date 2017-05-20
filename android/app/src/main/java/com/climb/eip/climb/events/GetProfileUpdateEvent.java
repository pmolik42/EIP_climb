package com.climb.eip.climb.events;

import com.climb.eip.climb.api.models.User;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Younes on 20/05/2017.
 */

public class GetProfileUpdateEvent {

    private User user;

    public GetProfileUpdateEvent(User user) {
        this.user = user;
    }

    public User getUser() {
        return this.user;
    }

    public JSONObject getUserJson() {
        JSONObject json = new JSONObject();

        try {
            if (this.user.getEmail() != null && this.user.getEmail() != "")
                json.put("email", this.user.getEmail());
            if (this.user.getBio() != null && this.user.getBio() != "")
                json.put("bio", this.user.getBio());
            if (this.user.getFirstName() != null && this.user.getFirstName() != "")
                json.put("firstName", this.user.getFirstName());
            if (this.user.getLastName() != null && this.user.getLastName() != "")
                json.put("lastName", this.user.getLastName());
            if (this.user.getUsername() != null && this.user.getUsername() != "")
                json.put("username", this.user.getUsername());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return json;
    }
}
