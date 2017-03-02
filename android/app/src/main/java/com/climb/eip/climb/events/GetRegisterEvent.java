package com.climb.eip.climb.events;

import com.climb.eip.climb.api.bodies.RegisterBody;

/**
 * Created by Younes on 02/03/2017.
 */

public class GetRegisterEvent {

    private RegisterBody mBody;

    public GetRegisterEvent(String email, String username, String password, String confirmPassword) {
        mBody = new RegisterBody(email, username, password, confirmPassword);
    }

    public RegisterBody getBody() {
        return mBody;
    }
}
