package com.climb.eip.climb.fragments;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.widget.LinearLayoutManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.climb.eip.climb.R;
import com.climb.eip.climb.activities.NavigationActivity;
import com.climb.eip.climb.adapters.VideoListAdapter;
import com.climb.eip.climb.api.models.Video;
import com.climb.eip.climb.bus.BusProvider;
import com.climb.eip.climb.events.GetProfileEvent;
import com.climb.eip.climb.manager.ClimbManager;
import com.climb.eip.climb.utils.Fetcher;
import com.squareup.otto.Bus;

import java.util.ArrayList;

/**
 * Created by Younes on 08/05/2017.
 */

public class NotificationsFragment extends BaseFragment {

    private Context mContext;
    private boolean isLoaded = false;
    private Bus mBus = BusProvider.getInstance();
    private ClimbManager mClimbManager;

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof Activity){
            mContext = context;
            mClimbManager = new ClimbManager(mContext, mBus);
            mBus.register(this);
            mBus.register(mClimbManager);
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

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup parent, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.notifications_fragment, parent, false);

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
    }

    @Override
    public String getToolbarTitle() {
        return "Notifications";//Fetcher.getInstance().fetchString(this.mActivity, R.string.notifications);
    }
}
