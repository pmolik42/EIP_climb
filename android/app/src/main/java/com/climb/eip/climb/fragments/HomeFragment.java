package com.climb.eip.climb.fragments;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.app.ListFragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.climb.eip.climb.R;
import com.climb.eip.climb.activities.NavigationActivity;
import com.climb.eip.climb.adapters.VideoListAdapter;
import com.climb.eip.climb.api.models.Video;
import com.climb.eip.climb.bus.BusProvider;
import com.climb.eip.climb.events.GetFailureEvent;
import com.climb.eip.climb.events.GetHomeEvent;
import com.climb.eip.climb.events.GetJsonDataEvent;
import com.climb.eip.climb.manager.ClimbManager;
import com.squareup.otto.Bus;
import com.squareup.otto.Subscribe;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;
import io.realm.Realm;

/**
 * Created by Younes on 24/03/2017.
 */

public class HomeFragment extends Fragment {

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
        mRecyclerVideo.setAdapter(new VideoListAdapter(mContext, mVideos));

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

    private Video createVideo(JSONObject object) throws JSONException {
        Video video = new Video(object.getString("title"), object.getString("url"));

        video.setLikes(0);
        video.setViews(0);
        video.setLiked(false);
        video.setCategory(object.getString("category"));
        video.setOwnerUsername(object.getString("ownerUsername"));
        video.setOwnerProfilePicture(object.getString("ownerProfilePicture").replace("localhost", "10.0.2.2"));
        video.setThumbnailVideo(object.getString("thumbnailUrl").replace("localhost", "10.0.2.2"));
        video.setDescription(object.getString("description"));

        return video;
    }

    @Subscribe
    public void onGetJsonDataEvent(GetJsonDataEvent event) {
        Log.d("HOME", "ON A RECU QQCHOSE");
        JSONObject object = event.getObject();

        try {
            mVideos.removeAll(mVideos);
            JSONArray videos = object.getJSONArray("videos");
            for (int i = 0; i < videos.length(); i++) {
                if (mVideos.size() < 5)
                    mVideos.add(createVideo(videos.getJSONObject(i)));
            }
            mRecyclerVideo.setLayoutManager(new LinearLayoutManager(mContext, LinearLayoutManager.VERTICAL, false));
            mRecyclerVideo.setAdapter(new VideoListAdapter(mContext, mVideos));
            isLoaded = true;
        } catch (JSONException e) {
            e.printStackTrace();
            Toast.makeText(getContext(), e.getMessage(), Toast.LENGTH_LONG).show();

        }

        mProgressBar.setVisibility(View.GONE);
        mRecyclerVideo.setVisibility(View.VISIBLE);
    }

    @Subscribe
    public void onGetFailureEvent(GetFailureEvent event) {
        Log.d("HOME", event.getMessage());
        String message = event.getMessage();
        mProgressBar.setVisibility(View.GONE);
        mRecyclerVideo.setVisibility(View.VISIBLE);
        Toast.makeText(getContext(), message, Toast.LENGTH_LONG).show();
    }
}
