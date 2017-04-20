package com.climb.eip.climb.api;


/**
 * Created by Younes on 01/03/2017.
 */

public class ClimbClientUrl {

    private static final String BASE_URL = "http://10.0.2.2:8080/api/";
    private static ClimbClientUrl mClimbClient;

    public static ClimbClientUrl getClient() {
        if (mClimbClient == null)
            mClimbClient = new ClimbClientUrl();
        return mClimbClient;
    }

    private ClimbClientUrl() {

    }

    public String authenticateUrl() {
        return BASE_URL + "authenticate";
    }

    public String registerUrl() {
        return BASE_URL + "register";
    }

    public String profileUrl(String username) {
        return BASE_URL + "profile/" + username;
    }
}
