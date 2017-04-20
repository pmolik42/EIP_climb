package com.climb.eip.climb.events;

import org.json.JSONObject;

/**
 * Created by Younes on 16/04/2017.
 */

public class GetJsonDataEvent {

    private JSONObject mObject;

    public GetJsonDataEvent(JSONObject object) {
        this.mObject = object;
    }

    public JSONObject getObject() {
        return mObject;
    }

    public void setObject(JSONObject object) {
        this.mObject = object;
    }
}
