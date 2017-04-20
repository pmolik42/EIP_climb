package com.climb.eip.climb.events;

/**
 * Created by Younes on 15/04/2017.
 */

public class GetProfileEvent {

    private String mUsername;

    public GetProfileEvent(String username) {
        mUsername = username;
    }

    public String getUsername() {
        return mUsername;
    }
}
