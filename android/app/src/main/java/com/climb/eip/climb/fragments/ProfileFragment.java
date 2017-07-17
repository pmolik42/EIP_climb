package com.climb.eip.climb.fragments;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.climb.eip.climb.R;
import com.climb.eip.climb.activities.EditProfileActivity;
import com.climb.eip.climb.activities.LoginActivity;
import com.climb.eip.climb.activities.NavigationActivity;
import com.climb.eip.climb.adapters.VideoListAdapter;
import com.climb.eip.climb.api.models.User;
import com.climb.eip.climb.api.models.Video;
import com.climb.eip.climb.bus.BusProvider;
import com.climb.eip.climb.events.GetFailureEvent;
import com.climb.eip.climb.events.GetJsonDataEvent;
import com.climb.eip.climb.events.GetProfileEvent;
import com.climb.eip.climb.events.GetProfileVideosEvent;
import com.climb.eip.climb.manager.ClimbManager;
import com.climb.eip.climb.utils.Fetcher;
import com.squareup.otto.Bus;
import com.squareup.otto.Subscribe;
import com.squareup.picasso.Picasso;
import com.volokh.danylo.video_player_manager.manager.PlayerItemChangeListener;
import com.volokh.danylo.video_player_manager.manager.SingleVideoPlayerManager;
import com.volokh.danylo.video_player_manager.manager.VideoPlayerManager;
import com.volokh.danylo.video_player_manager.meta.MetaData;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Younes on 24/03/2017.
 */

public class ProfileFragment extends BaseFragment {

    @Bind(R.id.followers) TextView mFollowers;
    @Bind(R.id.following) TextView mFollowing;
    @Bind(R.id.battles) TextView mBattles;

    @Bind(R.id.profileBio) TextView mBio;
    @Bind(R.id.profileName) TextView mName;

    @Bind(R.id.profilePicture) ImageView mProfilePicture;

    @Bind(R.id.profileContent) RelativeLayout mProfileContent;

    @Bind(R.id.videoTab) Button mVideosTabButton;
    @Bind(R.id.battleTab) Button mBattlesTabButton;
    @Bind(R.id.bookTab) Button mBookTabButton;
    @Bind(R.id.optionsButton) ImageView mOptions;
    @Bind(R.id.followButton) Button mFollowButton;
    @Bind(R.id.unfollowButton) Button mUnfollowButton;

    @Bind(R.id.listButton) ImageView mListButton;
    @Bind(R.id.gridButton) ImageView mGridButton;

    @Bind(R.id.progress) ProgressBar mProgressBar;

    @Bind(R.id.userVideos) RecyclerView mRecyclerVideo;

    private Context mContext;
    private NavigationActivity mListener;
    private List<Video> mVideos = new ArrayList<Video>();
    private String username;
    private Bus mBus = BusProvider.getInstance();
    private ClimbManager mClimbManager;
    private boolean isLoaded = false;
    private String pictureUrl;
    private boolean isBusRegistered = false;

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof Activity){
            this.mListener = (NavigationActivity) context;
            mContext = context;
            mClimbManager = new ClimbManager(mContext, mBus);
        }
    }

    @Override
    public void onHiddenChanged(boolean hidden) {
        super.onHiddenChanged(hidden);
        if (hidden == true) {
            mBus.unregister(this);
            mBus.unregister(mClimbManager);
            isBusRegistered = false;
            mVideoPlayerManager.stopAnyPlayback();
        } else {
            if (isBusRegistered == false) {
                mBus.register(this);
                mBus.register(mClimbManager);
                isBusRegistered = true;
            }

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
        mBattles.setVisibility(View.INVISIBLE);

        mName.setVisibility(View.INVISIBLE);
        mBio.setVisibility(View.INVISIBLE);

        mVideosTabButton.setEnabled(true);
        mBattlesTabButton.setEnabled(false);
        mBookTabButton.setEnabled(false);
        mListButton.setEnabled(true);
        mGridButton.setEnabled(false);


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
        Log.d("PROFILE", "username : " + username);
        if (!isLoaded) {
            mBus.register(this);
            mBus.register(mClimbManager);
            isBusRegistered = true;
            mBus.post(new GetProfileEvent(username));
        }
        mRecyclerVideo.setLayoutManager(new LinearLayoutManager(mContext, LinearLayoutManager.VERTICAL, false));
        mRecyclerVideo.setAdapter(new VideoListAdapter(mContext, new ArrayList<Video>(), this));
    }

    @Override
    public String getToolbarTitle() {
        return username;
    }

    private void initDialogOptions() {
        final Dialog dialog = new Dialog(mContext);
        dialog.setContentView(R.layout.profile_options_dialog_box);

        Window window = dialog.getWindow();
        WindowManager.LayoutParams wlp = window.getAttributes();

        wlp.gravity = Gravity.BOTTOM;
        wlp.width = WindowManager.LayoutParams.MATCH_PARENT;
        wlp.height = WindowManager.LayoutParams.WRAP_CONTENT;
        window.setAttributes(wlp);

        TextView logoutLink = (TextView) dialog.findViewById(R.id.logoutLink);
        TextView cancelLink = (TextView) dialog.findViewById(R.id.cancelLink);
        TextView editProfileLink = (TextView) dialog.findViewById(R.id.editProfileLink);

        editProfileLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, EditProfileActivity.class);
                mListener.startActivity(intent);
            }
        });
        logoutLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                SharedPreferences sharedPref = getActivity().getSharedPreferences(getString(R.string.sharedPreference), Context.MODE_PRIVATE);
                SharedPreferences.Editor editor = sharedPref.edit();
                editor.putString(getString(R.string.token), "");
                editor.commit();

                Intent intent = new Intent(mContext, LoginActivity.class);
                mListener.startActivity(intent);
                mListener.finish();
            }
        });
        cancelLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });

        dialog.show();
    }

    private Video createVideo(JSONObject object, String username, String pictureUrl) {
        Video video = new Video(object.optString("title"), object.optString("url"));

        video.setId(object.optString("_id"));
        video.setLikes(object.optInt("likes"));
        video.setViews(0);
        video.setComments(0);
        video.setLiked(object.optBoolean("isLiked"));
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

    private void onVideosReceived(JSONArray videos, String username, String pictureUrl) {
        for (int i = 0; i < videos.length(); i++) {
            Video video = createVideo(videos.optJSONObject(i), username, pictureUrl);
            if (mVideos.size() < 5)
                mVideos.add(video);
        }

        mRecyclerVideo.setAdapter(new VideoListAdapter(mContext, mVideos, this));
        mRecyclerVideo.setVisibility(View.VISIBLE);
        mProgressBar.setVisibility(View.GONE);


    }

    private void onProfileReceived(JSONObject object) {
        JSONObject profile = object.optJSONObject("user").optJSONObject("profile");

        if (object.optBoolean("isOwner")) {
            mOptions.setVisibility(View.VISIBLE);
            mOptions.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    initDialogOptions();
                }
            });
        } else {
            if (object.optBoolean("isFollowing")) {
                mUnfollowButton.setVisibility(View.VISIBLE);
            } else {
                mFollowButton.setVisibility(View.VISIBLE);
            }
        }

        mFollowers.setText(object.optString("followers") + "\nFollowers");
        mFollowing.setText(object.optString("following") + "\nFollowing");
        mBattles.setText("0\nBattles");

        mFollowing.setVisibility(View.VISIBLE);
        mFollowers.setVisibility(View.VISIBLE);
        mBattles.setVisibility(View.VISIBLE);

        mName.setText(profile.optString("firstName") + " " + profile.optString("lastName"));
        mBio.setText(profile.optString("bio"));
        mName.setVisibility(View.VISIBLE);
        mBio.setVisibility(View.VISIBLE);

        pictureUrl = profile.optString("pictureUrl");
        if (pictureUrl.length() > 0)
            Picasso.with(mContext).load(pictureUrl.replace("localhost", "10.0.2.2")).into(mProfilePicture);

    }

    @Override
    public void onResume() {
        super.onResume();
        if (isBusRegistered == false) {
            mBus.register(this);
            mBus.register(mClimbManager);
            isBusRegistered = true;
        }

    }

    @Subscribe
    public void onGetJsonDataEvent(final GetJsonDataEvent event) {
        Log.d("PROFILE", "ON A RECU LES DATA");
        JSONObject object = event.getObject();

        if (object.optJSONArray("videos") != null) {
            mVideos.removeAll(mVideos);
            onVideosReceived(object.optJSONArray("videos"), object.optString("username"), object.optString("userProfilePicture"));
        } else if (object.optJSONObject("user") != null) {
            onProfileReceived(object);
            mBus.post(new GetProfileVideosEvent(username));
        } else if (object.optJSONObject("newUser") != null) {
            JSONObject profile = object.optJSONObject("newUser").optJSONObject("profile");
            mName.setText(profile.optString("firstName") + " " + profile.optString("lastName"));
            mBio.setText(profile.optString("bio"));
            setUsername(profile.optString("username"));
            mActivity.setToolbarTitle(profile.optString("username"));
        }
    }

    @Subscribe
    public void onGetFailureEvent(final GetFailureEvent event) {
        Log.d("PROFILE", event.getMessage());
        String message = event.getMessage();
        mProgressBar.setVisibility(View.GONE);
        mRecyclerVideo.setVisibility(View.VISIBLE);
        if (event.getStatusCode() != 200) {
            SharedPreferences sharedPref = mContext.getSharedPreferences(mContext.getString(R.string.sharedPreference), Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putString(mContext.getString(R.string.token), "");
            editor.commit();

            Intent intent = new Intent(mContext, LoginActivity.class);
            mContext.startActivity(intent);
            mListener.finish();
        } else
            Toast.makeText(getContext(), message, Toast.LENGTH_LONG).show();
    }
}
