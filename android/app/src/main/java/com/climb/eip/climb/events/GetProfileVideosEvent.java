package com.climb.eip.climb.events;

/**
 * Created by Younes on 23/04/2017.
 */

public class GetProfileVideosEvent {
    private String username;

    public GetProfileVideosEvent(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
