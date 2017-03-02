package com.climb.eip.climb.api.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Younes on 01/03/2017.
 */

public class Session extends HttpResponseBody {
    @SerializedName("token")
    private String token;

    public String getToken() {
        return token;
    }
}
