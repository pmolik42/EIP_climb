package com.climb.eip.climb.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.View;

import com.climb.eip.climb.activities.NavigationActivity;
import com.climb.eip.climb.utils.AppConstants;
import com.climb.eip.climb.utils.ClickEventData;
import com.volokh.danylo.video_player_manager.manager.PlayerItemChangeListener;
import com.volokh.danylo.video_player_manager.manager.SingleVideoPlayerManager;
import com.volokh.danylo.video_player_manager.manager.VideoPlayerManager;
import com.volokh.danylo.video_player_manager.meta.MetaData;
import com.volokh.danylo.video_player_manager.ui.VideoPlayerView;

/**
 * Created by Younes on 07/05/2017.
 */

public class BaseFragment extends Fragment implements View.OnClickListener {
    protected NavigationActivity mActivity;

    protected VideoPlayerManager<MetaData> mVideoPlayerManager = new SingleVideoPlayerManager(new PlayerItemChangeListener() {
        @Override
        public void onPlayerItemChanged(MetaData metaData) {
        }
    });

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mActivity = (NavigationActivity) this.getActivity();
    }

    public void onBackPressed(){
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data){
    }

    public String getToolbarTitle() {
        return "";
    }

    @Override
    public void onClick(View view) {
        if (((ClickEventData)view.getTag()).getClickEvent() == AppConstants.USERNAME_CLICK)
            mActivity.pushNewFragment(view);
        if (((ClickEventData)view.getTag()).getClickEvent() == AppConstants.VIDEO_PLAY_CLICK)
            mVideoPlayerManager.playNewVideo(null, (VideoPlayerView) view, ((ClickEventData)view.getTag()).getData());

        //mActivity.playVideo(view, ((ClickEventData)view.getTag()).getData());
    }
}
