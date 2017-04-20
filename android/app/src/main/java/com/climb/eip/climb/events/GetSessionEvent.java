package com.climb.eip.climb.events;

import com.climb.eip.climb.api.models.Session;
import com.climb.eip.climb.api.models.User;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Younes on 01/03/2017.
 */

public class GetSessionEvent {

    private JSONObject mSessionObject;
    private String mToken;
    private User mUser;
    private String mMessage;

    public GetSessionEvent(JSONObject resultObject) throws JSONException {
        this.mSessionObject = resultObject;

        this.mToken = resultObject.getString("token");
        this.mMessage = resultObject.getString("message");
        this.mUser = new User(resultObject.getJSONObject("user"));

    }

    public JSONObject getSessionObject() {
        return mSessionObject;
    }

    public String getMessage() {
        return mMessage;
    }

    public String getToken() {
        return mToken;
    }

    public User getUser() {
        return mUser;
    }
}
