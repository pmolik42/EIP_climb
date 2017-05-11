package com.climb.eip.climb.activities;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.climb.eip.climb.R;
import com.climb.eip.climb.bus.BusProvider;
import com.climb.eip.climb.events.GetFailureEvent;
import com.climb.eip.climb.events.GetLoginEvent;
import com.climb.eip.climb.events.GetSessionEvent;
import com.climb.eip.climb.manager.ClimbManager;
import com.squareup.otto.Bus;
import com.squareup.otto.Subscribe;

import butterknife.Bind;
import butterknife.ButterKnife;


/**
 * Created by Younes on 24/03/2017.
 */

public class LoginActivity extends AppCompatActivity {

    public final static String TAG = "LoginActivity";

    @Bind(R.id.emailField) EditText mUsernameField;
    @Bind(R.id.passwordField) EditText mPasswordField;

    @Bind(R.id.loginButton) Button mLoginButton;
    @Bind(R.id.facebookSignupButton) Button facebookSignupButton;
    @Bind(R.id.googleSignupButton) Button googleSignupButton;

    @Bind(R.id.noAccountTextView) TextView noAccountTextView;
    @Bind(R.id.registerLink) TextView registerLink;
    @Bind(R.id.forgotPasswordLink) TextView forgotPasswordLink;

    private String mEmail;
    private String mPassword;

    private ClimbManager mClimbManager;
    private Bus mBus = BusProvider.getInstance();
    private Context mContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login_layout);

        mContext = this;
        ButterKnife.bind(this);

        mClimbManager = new ClimbManager(this, mBus);

        String token = getSharedPreferences(getString(R.string.sharedPreference), Context.MODE_PRIVATE).getString(getString(R.string.token), "");
        if (token.length() > 0) {
            Intent intent = new Intent(mContext, NavigationActivity.class);
            startActivity(intent);
            finish();
        }

        this.initLoginButton();
        this.initRegisterLink();

    }

    @Override
    protected void onResume() {
        super.onResume();
        mBus.register(mClimbManager);
        mBus.register(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        mBus.unregister(mClimbManager);
        mBus.unregister(this);
    }

    @Override
    protected void onStop() {
        super.onStop();
    }

    private void initLoginButton() {
        this.mLoginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mLoginButton.setEnabled(false);
                mEmail = mUsernameField.getText().toString();
                mPassword = mPasswordField.getText().toString();
                mBus.post(new GetLoginEvent(mEmail, mPassword));
            }
        });
    }

    private void initRegisterLink() {
        this.registerLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(mContext, AuthActivity.class);
                startActivity(intent);
                finish();
            }
        });
    }

    @Subscribe
    public void onGetSessionEvent(final GetSessionEvent event) {
        String username = event.getUser().getUsername();
        String token = event.getToken();
        Log.d(TAG, "username : " + username);


        SharedPreferences sharedPref = getSharedPreferences(getString(R.string.sharedPreference), Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.putString(getString(R.string.token), token);
        editor.putString(getString(R.string.username), username);

        editor.commit();

        Intent intent = new Intent(mContext, NavigationActivity.class);
        startActivity(intent);
        finish();

    }

    @Subscribe
    public void onGetFailureEvent(GetFailureEvent event) {
        mLoginButton.setEnabled(true);
        Toast.makeText(this, event.getMessage(), Toast.LENGTH_SHORT).show();
    }
}
