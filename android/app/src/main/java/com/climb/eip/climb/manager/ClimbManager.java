package com.climb.eip.climb.manager;

import android.content.Context;
import android.util.Log;

import com.climb.eip.climb.api.ClimbClient;
import com.climb.eip.climb.api.models.Session;
import com.climb.eip.climb.events.GetFailureEvent;
import com.climb.eip.climb.events.GetLoginEvent;
import com.climb.eip.climb.events.GetRegisterEvent;
import com.climb.eip.climb.events.GetSessionEvent;
import com.squareup.otto.Bus;
import com.squareup.otto.Subscribe;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by Younes on 01/03/2017.
 */

public class ClimbManager {

    private Context mContext;
    private Bus mBus;
    private ClimbClient sClimbClient;

    public ClimbManager(Context context, Bus bus) {
        this.mContext = context;
        this.mBus = bus;
        sClimbClient = ClimbClient.getClient();
    }

    @Subscribe
    public void onGetLoginEvent(GetLoginEvent event) {

        sClimbClient.authenticate(event.getBody()).enqueue(new Callback<Session>() {
            @Override
            public void onResponse(Call<Session> call, Response<Session> response) {
                Session session = response.body();
                if (session.getSuccess() == true) {
                    mBus.post(new GetSessionEvent((session)));
                } else {
                    mBus.post(new GetFailureEvent(session.getMessage()));
                }
            }

            @Override
            public void onFailure(Call<Session> call, Throwable t) {
                call.cancel();
                mBus.post(new GetFailureEvent(t.getMessage()));
            }
        });
    }

    @Subscribe
    public void onGetRegisterEvent(GetRegisterEvent event) {

        sClimbClient.register(event.getBody()).enqueue(new Callback<Session>() {
            @Override
            public void onResponse(Call<Session> call, Response<Session> response) {
                Session session = response.body();
                if (session.getSuccess() == true) {
                    Log.d("ClimbManager", session.getMessage());
                    mBus.post(new GetSessionEvent((session)));
                } else {
                    mBus.post(new GetFailureEvent(session.getMessage()));
                }
            }

            @Override
            public void onFailure(Call<Session> call, Throwable t) {
                call.cancel();
                Log.d("ClimbManager", t.getMessage());
                mBus.post(new GetFailureEvent(t.getMessage()));
            }
        });
    }
}
