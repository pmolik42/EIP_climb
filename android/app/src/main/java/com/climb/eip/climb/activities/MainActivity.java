package com.climb.eip.climb.activities;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.climb.eip.climb.R;
import com.climb.eip.climb.bus.BusProvider;
import com.climb.eip.climb.events.GetFailureEvent;
import com.climb.eip.climb.events.GetLoginEvent;
import com.climb.eip.climb.events.GetRegisterEvent;
import com.climb.eip.climb.events.GetSessionEvent;
import com.climb.eip.climb.manager.ClimbManager;
import com.squareup.otto.Bus;
import com.squareup.otto.Subscribe;

public class MainActivity extends AppCompatActivity {

    final private String TAG = "MainActivity";

    private RelativeLayout authLayout;

    private TextView climbTitle;
    private TextView signupLink;
    private TextView loginLink;

    private EditText loginUsernameField;
    private EditText loginPasswordField;
    private EditText signupEmailField;
    private EditText signupUsernameField;
    private EditText signupPasswordField;
    private EditText signupConfirmPasswordField;

    private Button loginButton;
    private Button signupButton;

    private LinearLayout loginLayout;
    private LinearLayout signupLayout;

    private String signupEmail;
    private String signupUsername;
    private String signupPassword;
    private String signupConfirmPassword;
    private String loginEmail;
    private String loginPassword;

    private ClimbManager mClimbManager;
    private Bus mBus = BusProvider.getInstance();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mClimbManager = new ClimbManager(this, mBus);

        climbTitle = (TextView)findViewById(R.id.climb);
        authLayout = (RelativeLayout)findViewById(R.id.authLayout);

        initLoginLayout();
        initSignupLayout();

        this.setLayout(loginLayout);
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

    private void initLoginLayout() {

        loginLayout = (LinearLayout)getLayoutInflater().inflate(R.layout.login_layout, null);

        this.loginButton = (Button)loginLayout.findViewById(R.id.loginButton);
        this.loginUsernameField = (EditText)loginLayout.findViewById(R.id.usernameField);
        this.loginPasswordField = (EditText)loginLayout.findViewById(R.id.passwordField);
        this.signupLink = (TextView)loginLayout.findViewById(R.id.signupLink);

        this.loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                loginButton.setEnabled(false);
                loginEmail = loginUsernameField.getText().toString();
                loginPassword = loginPasswordField.getText().toString();
                mBus.post(new GetLoginEvent(loginEmail, loginPassword));
            }
        });

        this.signupLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                loginLayout.setVisibility(View.GONE);
                setLayout(signupLayout);
            }
        });

    }

    private void initSignupLayout() {

        signupLayout = (LinearLayout)getLayoutInflater().inflate(R.layout.signup_layout, null);

        this.signupButton = (Button)signupLayout.findViewById(R.id.signupButton);
        this.signupEmailField = (EditText)signupLayout.findViewById(R.id.emailField);
        this.signupUsernameField = (EditText)signupLayout.findViewById(R.id.usernameField);
        this.signupPasswordField = (EditText)signupLayout.findViewById(R.id.passwordField);
        this.signupConfirmPasswordField = (EditText)signupLayout.findViewById(R.id.confirmPasswordField);
        this.loginLink = (TextView)signupLayout.findViewById(R.id.loginLink);

        this.signupButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                signupButton.setEnabled(false);
                signupEmail = signupEmailField.getText().toString();
                signupUsername = signupUsernameField.getText().toString();
                signupPassword = signupPasswordField.getText().toString();
                signupConfirmPassword = signupConfirmPasswordField.getText().toString();
                mBus.post(new GetRegisterEvent(signupEmail, signupUsername, signupPassword, signupConfirmPassword));
            }
        });

        this.loginLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                signupLayout.setVisibility(View.GONE);
                setLayout(loginLayout);
            }
        });
    }

    private void setLayout(LinearLayout layout) {

        if (layout.getVisibility() == View.GONE) {
            layout.setVisibility(View.VISIBLE);
        } else {
            RelativeLayout.LayoutParams relativeParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT,
                    RelativeLayout.LayoutParams.WRAP_CONTENT);
            relativeParams.addRule(RelativeLayout.BELOW, climbTitle.getId());
            relativeParams.setMargins(0, 50, 0, 0);
            this.authLayout.addView(layout, relativeParams);
        }
    }

    @Subscribe
    public void onGetSessionEvent(GetSessionEvent event) {
        loginButton.setEnabled(true);
        signupButton.setEnabled(true);
        Toast.makeText(this, event.getSession().getMessage(), Toast.LENGTH_LONG).show();
    }

    @Subscribe
    public void onGetFailureEvent(GetFailureEvent event) {
        loginButton.setEnabled(true);
        signupButton.setEnabled(true);
        Toast.makeText(this, event.getMessage(), Toast.LENGTH_LONG).show();
    }
}
