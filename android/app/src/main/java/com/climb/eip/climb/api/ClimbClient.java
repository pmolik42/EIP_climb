package com.climb.eip.climb.api;

import com.climb.eip.climb.api.bodies.LoginBody;
import com.climb.eip.climb.api.bodies.RegisterBody;
import com.climb.eip.climb.api.interfaces.ApiInterface;
import com.climb.eip.climb.api.models.Session;

import okhttp3.OkHttpClient;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Created by Younes on 01/03/2017.
 */

public class ClimbClient {

    private static final String BASE_URL = "http://10.0.2.2:8080/api/";
    private static ClimbClient mClimbClient;
    private static Retrofit mRetrofit;
    private static ApiInterface mService;

    public static ClimbClient getClient() {
        if (mClimbClient == null)
            mClimbClient = new ClimbClient();
        return mClimbClient;
    }

    private ClimbClient() {
         mRetrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:8080/api/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        mService = mRetrofit.create(ApiInterface.class);
    }

    public Call<Session> authenticate(LoginBody body) {
        return mService.authenticate(body);
    }

    public Call<Session> register(RegisterBody body) {
        return mService.registration(body);
    }
}
