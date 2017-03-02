package com.climb.eip.climb.api.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Younes on 01/03/2017.
 */

public abstract class HttpResponseBody {
    @SerializedName("success")
    protected Boolean success;

    @SerializedName("message")
    protected String message;

    public Boolean getSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
}
