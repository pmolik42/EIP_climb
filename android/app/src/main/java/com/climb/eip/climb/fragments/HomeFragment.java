package com.climb.eip.climb.fragments;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.climb.eip.climb.R;
import com.climb.eip.climb.activities.LoginActivity;
import com.climb.eip.climb.activities.NavigationActivity;
import com.climb.eip.climb.adapters.VideoListAdapter;
import com.climb.eip.climb.api.models.Video;
import com.climb.eip.climb.bus.BusProvider;
import com.climb.eip.climb.events.GetFailureEvent;
import com.climb.eip.climb.events.GetHomeEvent;
import com.climb.eip.climb.events.GetJsonDataEvent;
import com.climb.eip.climb.manager.ClimbManager;
import com.climb.eip.climb.utils.Fetcher;
import com.squareup.otto.Bus;
import com.squareup.otto.Subscribe;
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

public class HomeFragment extends BaseFragment {

    @Bind(R.id.progress) ProgressBar mProgressBar;

    @Bind(R.id.userVideos) RecyclerView mRecyclerVideo;

    private Context mContext;
    private NavigationActivity mListener;
    private List<Video> mVideos = new ArrayList<Video>();
    private Bus mBus = BusProvider.getInstance();
    private boolean isLoaded = false;
    private ClimbManager mClimbManager;


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof Activity){
            mContext = context;
            mClimbManager = new ClimbManager(mContext, mBus);
            mBus.register(mClimbManager);
            mBus.register(this);
            this.mListener = (NavigationActivity) context;
        }
    }

    @Override
    public void onHiddenChanged(boolean hidden) {
        super.onHiddenChanged(hidden);
        if (hidden == true) {
            mBus.unregister(this);
            mBus.unregister(mClimbManager);
            mVideoPlayerManager.stopAnyPlayback();
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
    public void onResume() {
        super.onResume();

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup parent, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.home_fragment, parent, false);
        ButterKnife.bind(this, view);

        mProgressBar.setVisibility(View.VISIBLE);
        mRecyclerVideo.setVisibility(View.INVISIBLE);
        mRecyclerVideo.setEnabled(false);
        mRecyclerVideo.setLayoutManager(new LinearLayoutManager(mContext, LinearLayoutManager.VERTICAL, false));
        mRecyclerVideo.setAdapter(new VideoListAdapter(mContext, mVideos, this));

        return view;
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        isLoaded = false;
    }

    @Override
    public void onDetach() {
        super.onDetach();
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        if (!isLoaded) {
            mBus.post(new GetHomeEvent());
        }
    }

    @Override
    public String getToolbarTitle() {
        return "Home";//Fetcher.getInstance().fetchString(mContext, R.string.home);
    }

    private Video createVideo(JSONObject object) {
        Video video = new Video(object.optString("title"), object.optString("url"));

        video.setId(object.optString("_id"));
        video.setLikes(object.optInt("likes"));
        video.setViews(0);
        video.setComments(0);
        video.setLiked(object.optBoolean("isLiked"));
        video.setCategory(object.optString("category"));
        video.setOwnerUsername(object.optString("ownerUsername"));
        video.setOwnerProfilePicture(object.optString("ownerProfilePicture").replace("localhost", "10.0.2.2"));
        video.setThumbnailVideo(object.optString("thumbnailUrl").replace("localhost", "10.0.2.2"));
        video.setDescription(object.optString("description"));

        return video;
    }

    @Subscribe
    public void onGetJsonDataEvent(final GetJsonDataEvent event) {
        Log.d("HOME", "ON A RECU LES DATA");
        JSONObject object = event.getObject();

        mVideos.removeAll(mVideos);
        JSONArray videos = object.optJSONArray("videos");
        for (int i = 0; i < videos.length(); i++) {
            mVideos.add(createVideo(videos.optJSONObject(i)));
        }
        mRecyclerVideo.setLayoutManager(new LinearLayoutManager(mContext, LinearLayoutManager.VERTICAL, false));
        mRecyclerVideo.setAdapter(new VideoListAdapter(mContext, mVideos, this));
        isLoaded = true;

        mProgressBar.setVisibility(View.GONE);
        mRecyclerVideo.setVisibility(View.VISIBLE);
    }

    @Subscribe
    public void onGetFailureEvent(final GetFailureEvent event) {
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
