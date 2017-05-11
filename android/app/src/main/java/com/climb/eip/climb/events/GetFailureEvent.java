package com.climb.eip.climb.events;

/**
 * Created by Younes on 01/03/2017.
 */

public class GetFailureEvent {

    private String mMessage;
    private int mStatusCode;

    public GetFailureEvent(String message) {
        mMessage = message;
        mStatusCode = 200;
    }

    public GetFailureEvent(String message, int statusCode) {
        mMessage = message;
        mStatusCode = statusCode;
    }

    public String getMessage() {
        return mMessage;
    }

    public int getStatusCode() {
        return mStatusCode;
    }
}
