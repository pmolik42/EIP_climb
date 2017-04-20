package com.climb.eip.climb.api.models;


/**
 * Created by Younes on 01/03/2017.
 */

public abstract class HttpResponseBody {
    protected Boolean success;

    protected String message;

    public Boolean getSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
}
