package com.climb.eip.climb.activities;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.climb.eip.climb.R;
import com.climb.eip.climb.adapters.VideoListAdapter;
import com.climb.eip.climb.api.models.User;
import com.climb.eip.climb.bus.BusProvider;
import com.climb.eip.climb.events.GetFailureEvent;
import com.climb.eip.climb.events.GetJsonDataEvent;
import com.climb.eip.climb.events.GetProfileEvent;
import com.climb.eip.climb.events.GetProfileUpdateEvent;
import com.climb.eip.climb.manager.ClimbManager;
import com.mikhaellopez.circularimageview.CircularImageView;
import com.squareup.otto.Bus;
import com.squareup.otto.Subscribe;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONObject;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Younes on 20/05/2017.
 */

public class EditProfileActivity extends AppCompatActivity {

    public static final String TAG = "EditProfileActivity";

    @Bind(R.id.profilePicture) CircularImageView mProfilePicture;
    @Bind(R.id.backButton) ImageButton mCancelButton;

    @Bind(R.id.changeProfilePictureLink) TextView mChangerPictureLink;
    @Bind(R.id.saveLink) TextView mSaveLink;

    @Bind(R.id.usernameField) EditText mUsernameField;
    @Bind(R.id.firstNameField) EditText mFirstNameField;
    @Bind(R.id.lastNameField) EditText mLastNameField;
    @Bind(R.id.bioField) EditText mBioField;

    @Bind(R.id.emailField) EditText mEmailField;
    @Bind(R.id.genderField) EditText mGenderField;
    @Bind(R.id.phoneField) EditText mPhoneField;
    private JSONObject mUser;

    private ClimbManager mClimbManager;
    private Bus mBus = BusProvider.getInstance();

    private Context mContext;


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.edit_profile_layout);
        mContext = this;

        ButterKnife.bind(this);
        mClimbManager = new ClimbManager(this, mBus);


        mCancelButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        mSaveLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                User user = new User(mUser);
                user.setEmail(mEmailField.getText().toString());
                user.setBio(mBioField.getText().toString());
                user.setUsername(mUsernameField.getText().toString());
                user.setFirstName(mFirstNameField.getText().toString());
                user.setLastName(mLastNameField.getText().toString());

                mBus.post(new GetProfileUpdateEvent(user));

            }
        });

    }

    @Override
    protected void onResume() {
        super.onResume();
        String username = getSharedPreferences(getString(R.string.sharedPreference), Context.MODE_PRIVATE).getString(getString(R.string.username), "");
        mBus.register(mClimbManager);
        mBus.register(this);
        mBus.post(new GetProfileEvent(username));
    }

    @Override
    protected void onStop() {
        mBus.unregister(mClimbManager);
        mBus.unregister(this);
        super.onStop();
    }

    @Subscribe
    public void onGetJsonDataEvent(final GetJsonDataEvent event) {
        Log.d("EditProfile", "ON A RECU LES DATA");
        JSONObject object = event.getObject();

        JSONObject user = object.optJSONObject("user");
        if (user != null) {
            mUser = user;
            mEmailField.setText(user.optJSONObject("local").optString("email"));
            mUsernameField.setText(user.optJSONObject("profile").optString("username"));
            if (user.optJSONObject("profile").optString("firstName") != "")
                mFirstNameField.setText(user.optJSONObject("profile").optString("firstName"));
            if (user.optJSONObject("profile").optString("lastName") != "")
                mLastNameField.setText(user.optJSONObject("profile").optString("lastName"));
            if (user.optJSONObject("profile").optString("bio") != "")
                mBioField.setText(user.optJSONObject("profile").optString("bio"));
            if (user.optJSONObject("profile").optString("gender") != "")
                mGenderField.setText(user.optJSONObject("profile").optString("gender"));
            String pictureUrl = user.optJSONObject("profile").optString("pictureUrl");
            if (pictureUrl.length() > 0)
                Picasso.with(mContext).load(pictureUrl.replace("localhost", "10.0.2.2")).into(mProfilePicture);

        } else {
            if ( object.optJSONObject("newUser") != null) {
                Toast.makeText(this, object.optString("message"), Toast.LENGTH_LONG).show();
                SharedPreferences sharedPref = getSharedPreferences(getString(R.string.sharedPreference), Context.MODE_PRIVATE);
                SharedPreferences.Editor editor = sharedPref.edit();
                editor.putString(getString(R.string.username), object.optJSONObject("newUser").optJSONObject("profile").optString("username"));

                editor.commit();
            }

        }
    }

    @Subscribe
    public void onGetFailureEvent(final GetFailureEvent event) {
        String message = event.getMessage();
        mEmailField.setText(mUser.optJSONObject("local").optString("email"));
        mUsernameField.setText(mUser.optJSONObject("profile").optString("username"));
        if (mUser.optJSONObject("profile").optString("firstName") != "")
            mFirstNameField.setText(mUser.optJSONObject("profile").optString("firstName"));
        if (mUser.optJSONObject("profile").optString("lastName") != "")
            mLastNameField.setText(mUser.optJSONObject("profile").optString("lastName"));
        if (mUser.optJSONObject("profile").optString("bio") != "")
            mBioField.setText(mUser.optJSONObject("profile").optString("bio"));
        if (mUser.optJSONObject("profile").optString("gender") != "")
            mGenderField.setText(mUser.optJSONObject("profile").optString("gender"));
        Toast.makeText(this, message, Toast.LENGTH_LONG).show();
    }
}
