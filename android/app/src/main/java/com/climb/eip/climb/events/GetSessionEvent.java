package com.climb.eip.climb.events;

import com.climb.eip.climb.api.models.Session;

/**
 * Created by Younes on 01/03/2017.
 */

public class GetSessionEvent {

    private Session mSession;

    public GetSessionEvent(Session session) {
        mSession = session;
    }

    public Session getSession() {
        return mSession;
    }
}
