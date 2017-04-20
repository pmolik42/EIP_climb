package com.climb.eip.climb.manager;

import android.content.Context;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.JsonObjectRequest;
import com.climb.eip.climb.AppController;
import com.climb.eip.climb.activities.LoginActivity;
import com.climb.eip.climb.activities.RegisterActivity;
import com.climb.eip.climb.api.ClimbClientUrl;
import com.climb.eip.climb.api.models.Session;
import com.climb.eip.climb.events.GetFailureEvent;
import com.climb.eip.climb.events.GetJsonDataEvent;
import com.climb.eip.climb.events.GetLoginEvent;
import com.climb.eip.climb.events.GetProfileEvent;
import com.climb.eip.climb.events.GetRegisterEvent;
import com.climb.eip.climb.events.GetSessionEvent;
import com.squareup.otto.Bus;
import com.squareup.otto.Subscribe;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;


/**
 * Created by Younes on 01/03/2017.
 */

public class ClimbManager {

    private static final String BASE_URL = "http://10.0.2.2:8080/api/";
    private static final String TAG = "ClimbManager";

    private Context mContext;
    private Bus mBus;
    private ClimbClientUrl sClimbClient;

    public ClimbManager(Context context, Bus bus) {
        this.mContext = context;
        this.mBus = bus;
        sClimbClient = ClimbClientUrl.getClient();
    }

    @Subscribe
    public void onGetLoginEvent(final GetLoginEvent event) {

        final String email = event.getBody().getEmail();
        final String password = event.getBody().getPassword();

        JSONObject obj = new JSONObject();
        try {
            obj.put("email", email);
            obj.put("password", password);
        } catch (JSONException e) {
            e.printStackTrace();
            mBus.post(new GetFailureEvent(e.getMessage()));
            return;
        }


        JsonObjectRequest jsonObjReq = buildRequest(Request.Method.POST,
                sClimbClient.authenticateUrl(), obj,
                new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        Log.d(TAG, response.toString());
                        try {
                            if (response.getBoolean("success") == true) {
                                mBus.post(new GetSessionEvent(response));
                            } else {
                                mBus.post(new GetFailureEvent(response.getString("message")));
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                            mBus.post(new GetFailureEvent(e.getMessage()));
                        }
                    }
                });

        AppController.getInstance().addToRequestQueue(jsonObjReq, LoginActivity.TAG);
    }

    @Subscribe
    public void onGetRegisterEvent(final GetRegisterEvent event) {

        final String email = event.getBody().getEmail();
        final String password = event.getBody().getPassword();
        final String username = event.getBody().getUsername();
        final String confirmPassword = event.getBody().getConfirmPassword();

        JSONObject obj = new JSONObject();
        try {
            obj.put("email", email);
            obj.put("password", password);
            obj.put("username", username);
            obj.put("confirmPassword", confirmPassword);
        } catch (JSONException e) {
            e.printStackTrace();
            mBus.post(new GetFailureEvent(e.getMessage()));
            return;
        }

        JsonObjectRequest jsonObjReq = buildRequest(Request.Method.POST,
                sClimbClient.registerUrl(), obj,
                new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        Log.d(TAG, response.toString());
                        try {
                            if (response.getBoolean("success") == true) {
                                mBus.post(new GetSessionEvent(response));
                            } else {
                                mBus.post(new GetFailureEvent(response.getString("message")));
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                            mBus.post(new GetFailureEvent(e.getMessage()));
                        }

                    }
                });

        AppController.getInstance().addToRequestQueue(jsonObjReq, RegisterActivity.TAG);
    }


    @Subscribe
    public void OnGetProfileEvent(final GetProfileEvent event) {
        final String username = event.getUsername();

        JsonObjectRequest jsonObjReq = buildRequest(Request.Method.GET, sClimbClient.profileUrl(username),
                null, new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.d(TAG, response.toString());
                        try {
                            if (response.getBoolean("success") == true) {
                                mBus.post(new GetJsonDataEvent(response));
                            } else {
                                mBus.post(new GetFailureEvent(response.getString("message")));
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                            mBus.post(new GetFailureEvent(e.getMessage()));
                        }
                    }
                });

        AppController.getInstance().addToRequestQueue(jsonObjReq, "Profile");
    }

    private JsonObjectRequest buildRequest(int method, String url, JSONObject obj, Response.Listener<JSONObject> responseListener) {

        JsonObjectRequest jsonObjReq = new JsonObjectRequest(method,
                url, obj,
                responseListener,
                new Response.ErrorListener() {

            @Override
            public void onErrorResponse(VolleyError error) {
                VolleyLog.d(TAG, "Error: " + error.getMessage());
                mBus.post(new GetFailureEvent(error.getLocalizedMessage()));
            }
        }) {};

        return jsonObjReq;
    }

}
