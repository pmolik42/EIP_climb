package com.climb.eip.climb.activities;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.climb.eip.climb.R;
import com.climb.eip.climb.bus.BusProvider;
import com.climb.eip.climb.events.GetFailureEvent;
import com.climb.eip.climb.events.GetRegisterEvent;
import com.climb.eip.climb.events.GetSessionEvent;
import com.climb.eip.climb.manager.ClimbManager;
import com.squareup.otto.Bus;
import com.squareup.otto.Subscribe;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Younes on 24/03/2017.
 */

public class RegisterActivity extends AppCompatActivity {

    public final static String TAG = "RegisterActivity";

    @Bind(R.id.emailField) EditText mEmailField;
    @Bind(R.id.passwordField) EditText mPasswordField;
    @Bind(R.id.usernameField) EditText mUsernameField;
    @Bind(R.id.confirmPasswordField) EditText mConfirmPasswordField;

    @Bind(R.id.loginButton) Button mLoginButton;
    @Bind(R.id.registerButton) Button mRegisterButton;

    private String mEmail;
    private String mUsername;
    private String mPassword;
    private String mConfirmPassword;

    private ClimbManager mClimbManager;
    private Bus mBus = BusProvider.getInstance();
    private Context mContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.signup_layout);
        mContext = this;
        ButterKnife.bind(this);

        mClimbManager = new ClimbManager(this, mBus);

        this.initLoginButton();
        this.initRegisterButton();

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

    private void initRegisterButton() {
        this.mRegisterButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mRegisterButton.setEnabled(false);
                mLoginButton.setEnabled(false);
                mEmail = mEmailField.getText().toString();
                mUsername = mUsernameField.getText().toString();
                mPassword = mPasswordField.getText().toString();
                mConfirmPassword = mConfirmPasswordField.getText().toString();
                mBus.post(new GetRegisterEvent(mEmail, mUsername, mPassword, mConfirmPassword));
            }
        });
    }

    private void initLoginButton() {
        mLoginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent= new Intent(mContext, LoginActivity.class);
                startActivity(intent);
                finish();
            }
        });
    }

    @Subscribe
    public void onGetSessionEvent(GetSessionEvent event) {
        //mLoginButton.setEnabled(true);
        //mRegisterButton.setEnabled(true);
        //Toast.makeText(this, event.getSession().getMessage(), Toast.LENGTH_SHORT).show();
        Intent intent = new Intent(this, NavigationActivity.class);
        startActivity(intent);
        finish();
    }

    @Subscribe
    public void onGetFailureEvent(GetFailureEvent event) {
        mLoginButton.setEnabled(true);
        mRegisterButton.setEnabled(true);
        Toast.makeText(this, event.getMessage(), Toast.LENGTH_SHORT).show();
    }
}
