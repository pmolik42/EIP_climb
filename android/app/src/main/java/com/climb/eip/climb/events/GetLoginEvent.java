package com.climb.eip.climb.events;

import com.climb.eip.climb.api.bodies.LoginBody;

/**
 * Created by Younes on 01/03/2017.
 */

public class GetLoginEvent {
    private LoginBody mBody;

    public GetLoginEvent(String email, String password) {
        mBody = new LoginBody(email, password);
    }

    public LoginBody getBody() {
        return mBody;
    }
}
