package com.climb.eip.climb.fragments;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.climb.eip.climb.R;
import com.climb.eip.climb.activities.LoginActivity;
import com.climb.eip.climb.activities.NavigationActivity;
import com.climb.eip.climb.adapters.VideoListAdapter;
import com.climb.eip.climb.api.models.User;
import com.climb.eip.climb.api.models.Video;
import com.climb.eip.climb.bus.BusProvider;
import com.climb.eip.climb.manager.ClimbManager;
import com.squareup.otto.Bus;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Younes on 24/03/2017.
 */

public class ProfileFragment extends Fragment {

    @Bind(R.id.followers) TextView mFollowers;
    @Bind(R.id.following) TextView mFollowing;
    @Bind(R.id.profileBio) TextView mBio;
    @Bind(R.id.profileName) TextView mName;

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
    private ClimbManager mManager;

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof Activity){
            this.mListener = (NavigationActivity) context;
            mContext = context;
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
        mListener.setToolbarTitle(username);
        createVideos();
        mRecyclerVideo.setLayoutManager(new LinearLayoutManager(mContext, LinearLayoutManager.VERTICAL, false));
        mRecyclerVideo.setAdapter(new VideoListAdapter(mContext, mVideos));
    }

    private void initLogoutButton() {
        mLogoutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, LoginActivity.class);
                startActivity(intent);
                getActivity().finish();
            }
        });
    }

    private void createVideos() {
        Video video1 = new Video("Freestyle Hip Hop | Bad and Boujee", "");
        video1.setLikes(469);
        video1.setViews(729);
        video1.setLiked(false);
        video1.setCategory("Dance");
        video1.setOwnerUsername("Nescah");
        video1.setDescription(mContext.getResources().getString(R.string.sampleBio));

        mVideos.add(video1);
        mVideos.add(video1);
        mVideos.add(video1);
        mVideos.add(video1);
        mVideos.add(video1);

    }



    public void setUsername(String username) {
        this.username = username;
    }
}
