package com.climb.eip.climb.fragments;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.climb.eip.climb.R;
import com.climb.eip.climb.activities.LoginActivity;
import com.climb.eip.climb.activities.NavigationActivity;
import com.climb.eip.climb.adapters.VideoListAdapter;
import com.climb.eip.climb.api.models.User;
import com.climb.eip.climb.api.models.Video;
import com.climb.eip.climb.bus.BusProvider;
import com.climb.eip.climb.events.GetFailureEvent;
import com.climb.eip.climb.events.GetHomeEvent;
import com.climb.eip.climb.events.GetJsonDataEvent;
import com.climb.eip.climb.events.GetProfileEvent;
import com.climb.eip.climb.events.GetProfileVideosEvent;
import com.climb.eip.climb.manager.ClimbManager;
import com.climb.eip.climb.realm.RealmUser;
import com.squareup.otto.Bus;
import com.squareup.otto.Subscribe;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;
import io.realm.Realm;
import io.realm.RealmAsyncTask;
import io.realm.RealmQuery;

/**
 * Created by Younes on 24/03/2017.
 */

public class ProfileFragment extends Fragment {

    @Bind(R.id.followers) TextView mFollowers;
    @Bind(R.id.following) TextView mFollowing;
    @Bind(R.id.profileBio) TextView mBio;
    @Bind(R.id.profileName) TextView mName;
    @Bind(R.id.numberOfVideos) TextView mNumberOfVideos;

    @Bind(R.id.profilePicture) ImageView mProfilePicture;

    @Bind(R.id.profileContent) RelativeLayout mProfileContent;

    @Bind(R.id.logout) Button mLogoutButton;
    @Bind(R.id.followButton) Button mFollowButton;

    @Bind(R.id.progress) ProgressBar mProgressBar;

    @Bind(R.id.userVideos) RecyclerView mRecyclerVideo;

    private Context mContext;
    private NavigationActivity mListener;
    private List<Video> mVideos = new ArrayList<Video>();
    private User user;
    private String username;
    private Bus mBus = BusProvider.getInstance();
    private ClimbManager mClimbManager;
    private boolean isLoaded = false;
    private String pictureUrl;
    private RealmAsyncTask asyncTask;
    private Realm realm = Realm.getDefaultInstance();

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof Activity){
            this.mListener = (NavigationActivity) context;
            mClimbManager = new ClimbManager(mContext, mBus);
            mBus.register(this);
            mBus.register(mClimbManager);
            mContext = context;
        }
    }

    @Override
    public void onHiddenChanged(boolean hidden) {
        super.onHiddenChanged(hidden);
        if (hidden == true) {
            mBus.unregister(this);
            mBus.unregister(mClimbManager);
        } else {
            mBus.register(this);
            mBus.register(mClimbManager);
        }
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup parent, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.profile_fragment, parent, false);
        ButterKnife.bind(this, view);

        mFollowing.setVisibility(View.INVISIBLE);
        mFollowers.setVisibility(View.INVISIBLE);
        mFollowButton.setVisibility(View.INVISIBLE);
        mName.setVisibility(View.INVISIBLE);
        mBio.setVisibility(View.INVISIBLE);
        mNumberOfVideos.setVisibility(View.INVISIBLE);
        mRecyclerVideo.setVisibility(View.INVISIBLE);
        mProgressBar.setVisibility(View.VISIBLE);

        return view;
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
    }

    @Override
    public void onDetach() {
        super.onDetach();
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        initLogoutButton();
        if (!isLoaded) {
            mBus.post(new GetProfileEvent(username));
        }
        mListener.setToolbarTitle(username);
        mRecyclerVideo.setLayoutManager(new LinearLayoutManager(mContext, LinearLayoutManager.VERTICAL, false));
        mRecyclerVideo.setAdapter(new VideoListAdapter(mContext, new ArrayList<Video>()));
    }

    private void initLogoutButton() {
        mVideos.removeAll(mVideos);
        mLogoutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                final RealmQuery<RealmUser> query = realm.where(RealmUser.class);
                realm.executeTransaction(new Realm.Transaction() {
                    @Override
                    public void execute(Realm realm) {
                        // remove single match
                        query.findFirst().deleteFromRealm();
                        Intent intent = new Intent(mContext, LoginActivity.class);
                        startActivity(intent);
                        mListener.finish();

                    }
                });


            }
        });
    }

    private Video createVideo(JSONObject object) {
        Video video = new Video(object.optString("title"), object.optString("url"));

        video.setLikes(0);
        video.setViews(0);
        video.setLiked(false);
        video.setCategory(object.optString("category"));
        video.setOwnerUsername(username);
        video.setOwnerProfilePicture(pictureUrl.replace("localhost", "10.0.2.2"));
        video.setThumbnailVideo(object.optString("thumbnailUrl").replace("localhost", "10.0.2.2"));
        video.setDescription(object.optString("description"));

        return video;
    }


    public void setUsername(String username) {
        this.username = username;
    }

    private void onVideosReceived(JSONArray videos) {
        for (int i = 0; i < videos.length(); i++) {
            Video video = createVideo(videos.optJSONObject(i));
            if (mVideos.size() < 5)
                mVideos.add(video);
        }

        mRecyclerVideo.setAdapter(new VideoListAdapter(mContext, mVideos));
        mNumberOfVideos.setText(videos.length() + " Videos");
        mNumberOfVideos.setVisibility(View.VISIBLE);
        mRecyclerVideo.setVisibility(View.VISIBLE);
        mProgressBar.setVisibility(View.GONE);


    }

    private void onProfileReceived(JSONObject object) {
        JSONObject profile = object.optJSONObject("user").optJSONObject("profile");

        mFollowers.setText(object.optString("followers") + " Followers");
        mFollowing.setText(object.optString("following") + " Following");
        mFollowing.setVisibility(View.VISIBLE);
        mFollowers.setVisibility(View.VISIBLE);

        mName.setText(profile.optString("firstName") + " " + profile.optString("lastName"));
        mBio.setText(profile.optString("bio"));
        mName.setVisibility(View.VISIBLE);
        mBio.setVisibility(View.VISIBLE);

        pictureUrl = profile.optString("pictureUrl");
        if (pictureUrl.length() > 0)
            Picasso.with(mContext).load(pictureUrl.replace("localhost", "10.0.2.2")).into(mProfilePicture);

    }

    @Subscribe
    public void onGetJsonDataEvent(GetJsonDataEvent event) {
        Log.d("HOME", "ON A RECU QQCHOSE");
        JSONObject object = event.getObject();

        if (object.optJSONArray("videos") != null) {
            mVideos.removeAll(mVideos);
            onVideosReceived(object.optJSONArray("videos"));
        } else {
            onProfileReceived(object);
            mBus.post(new GetProfileVideosEvent(username));
        }
    }

    @Subscribe
    public void onGetFailureEvent(GetFailureEvent event) {
        Log.d("PROFILE", event.getMessage());
        String message = event.getMessage();
        mProgressBar.setVisibility(View.GONE);
        mRecyclerVideo.setVisibility(View.VISIBLE);
        Toast.makeText(getContext(), message, Toast.LENGTH_LONG).show();
    }
}
