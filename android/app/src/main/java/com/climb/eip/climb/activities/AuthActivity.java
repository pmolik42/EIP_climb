package com.climb.eip.climb.activities;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.climb.eip.climb.R;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Younes on 05/05/2017.
 */

public class AuthActivity extends AppCompatActivity {

    public final static String TAG = "AuthActivity";

    @Bind(R.id.localSignupButton) Button localSignupButton;
    @Bind(R.id.facebookSignupButton) Button facebookSignupButton;
    @Bind(R.id.googleSignupButton) Button googleSignupButton;

    @Bind(R.id.haveAccountTextView) TextView haveAccountTextView;
    @Bind(R.id.loginLink) TextView loginLink;

    private Context mContext;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.auth_layout);
        mContext = this;

        ButterKnife.bind(this);

        localSignupButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, RegisterActivity.class);
                startActivity(intent);
                finish();
            }
        });

        loginLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, LoginActivity.class);
                startActivity(intent);
                finish();
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override
    protected void onStop() {
        super.onStop();
        ButterKnife.unbind(this);
    }
}
