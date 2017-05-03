package com.climb.eip.climb.activities;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.climb.eip.climb.R;
import com.climb.eip.climb.bus.BusProvider;
import com.climb.eip.climb.events.GetFailureEvent;
import com.climb.eip.climb.events.GetLoginEvent;
import com.climb.eip.climb.events.GetSessionEvent;
import com.climb.eip.climb.manager.ClimbManager;
import com.climb.eip.climb.realm.RealmUser;
import com.squareup.otto.Bus;
import com.squareup.otto.Subscribe;

import butterknife.Bind;
import butterknife.ButterKnife;
import io.realm.Realm;
import io.realm.RealmAsyncTask;
import io.realm.RealmQuery;

/**
 * Created by Younes on 24/03/2017.
 */

public class LoginActivity extends AppCompatActivity {

    public final static String TAG = "LoginActivity";

    @Bind(R.id.emailField) EditText mUsernameField;
    @Bind(R.id.passwordField) EditText mPasswordField;

    @Bind(R.id.loginButton) Button mLoginButton;
    @Bind(R.id.registerButton) Button mRegisterButton;

    private String mEmail;
    private String mPassword;

    private ClimbManager mClimbManager;
    private Bus mBus = BusProvider.getInstance();
    private Context mContext;
    private RealmAsyncTask asyncTask;
    private Realm realm = Realm.getDefaultInstance();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login_layout);

        mContext = this;
        ButterKnife.bind(this);

        mClimbManager = new ClimbManager(this, mBus);

        RealmQuery<RealmUser> query = realm.where(RealmUser.class);
        RealmUser user = query.findFirst();
        if (user != null && user.getToken().length() > 0) {
            Intent intent = new Intent(mContext, NavigationActivity.class);
            startActivity(intent);
            finish();
        }

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

    @Override
    protected void onStop() {
        super.onStop();
        if (asyncTask != null && !asyncTask.isCancelled()) {
            asyncTask.cancel();
        }
    }

    private void initLoginButton() {
        this.mLoginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mLoginButton.setEnabled(false);
                mRegisterButton.setEnabled(false);
                mEmail = mUsernameField.getText().toString();
                mPassword = mPasswordField.getText().toString();
                mBus.post(new GetLoginEvent(mEmail, mPassword));
            }
        });
    }

    private void initRegisterButton() {
        this.mRegisterButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(mContext, RegisterActivity.class);
                startActivity(intent);
                finish();
            }
        });
    }

    @Subscribe
    public void onGetSessionEvent(final GetSessionEvent event) {
        asyncTask = realm.executeTransactionAsync(new Realm.Transaction() {
            @Override
            public void execute(Realm realm) {
                RealmUser user = realm.createObject(RealmUser.class);
                user.setEmail(event.getUser().getEmail());
                user.setUsername(event.getUser().getUsername());
                user.setPassword(event.getUser().getPassword());
                user.setToken(event.getToken());
            }
        }, new Realm.Transaction.OnSuccess() {
            @Override
            public void onSuccess() {
                Intent intent = new Intent(mContext, NavigationActivity.class);
                startActivity(intent);
                finish();
            }
        }, new Realm.Transaction.OnError() {
            @Override
            public void onError(Throwable error) {

            }
        });
    }

    @Subscribe
    public void onGetFailureEvent(GetFailureEvent event) {
        mLoginButton.setEnabled(true);
        mRegisterButton.setEnabled(true);
        Toast.makeText(this, event.getMessage(), Toast.LENGTH_SHORT).show();
    }
}
