package com.climb.eip.climb.events;

/**
 * Created by Younes on 01/03/2017.
 */

public class GetFailureEvent {

    private String mMessage;

    public GetFailureEvent(String message) {
        mMessage = message;
    }

    public String getMessage() {
        return mMessage;
    }
}
