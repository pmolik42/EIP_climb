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
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.ProgressBar;

import com.climb.eip.climb.R;
import com.climb.eip.climb.activities.NavigationActivity;
import com.climb.eip.climb.adapters.VideoListAdapter;
import com.climb.eip.climb.api.models.Video;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Younes on 24/03/2017.
 */

public class HomeFragment extends Fragment {

    @Bind(R.id.progress) ProgressBar mProgressBar;

    @Bind(R.id.userVideos) RecyclerView mRecyclerVideo;

    private Context mContext;
    private NavigationActivity mListener;
    private List<Video> mVideos = new ArrayList<Video>();

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof Activity){
            mContext = context;
            this.mListener = (NavigationActivity) context;
        }
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup parent, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.home_fragment, parent, false);
        ButterKnife.bind(this, view);

        return view;
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
    }

    @Override
    public void onDetach() {
        super.onDetach();
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        createVideos();
        mRecyclerVideo.setLayoutManager(new LinearLayoutManager(mContext, LinearLayoutManager.VERTICAL, false));
        mRecyclerVideo.setAdapter(new VideoListAdapter(mContext, mVideos));
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
}
