package com.climb.eip.climb.api.interfaces;

import com.climb.eip.climb.api.bodies.LoginBody;
import com.climb.eip.climb.api.bodies.RegisterBody;
import com.climb.eip.climb.api.models.Session;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;
import retrofit2.http.Path;

/**
 * Created by Younes on 01/03/2017.
 */

public interface ApiInterface {

    @POST("authenticate")
    Call<Session> authenticate(@Body LoginBody body);
    @POST("register")
    Call<Session> registration(@Body RegisterBody body);
}
