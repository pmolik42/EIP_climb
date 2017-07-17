package com.climb.eip.climb.activities;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.TextView;

import com.aurelhubert.ahbottomnavigation.AHBottomNavigation;
import com.aurelhubert.ahbottomnavigation.AHBottomNavigationItem;
import com.climb.eip.climb.R;
import com.climb.eip.climb.fragments.BaseFragment;
import com.climb.eip.climb.fragments.DiscoverFragment;
import com.climb.eip.climb.fragments.HomeFragment;
import com.climb.eip.climb.fragments.NotificationsFragment;
import com.climb.eip.climb.fragments.ProfileFragment;
import com.climb.eip.climb.utils.AppConstants;
import com.climb.eip.climb.utils.ClickEventData;
import com.climb.eip.climb.utils.Fetcher;
import com.volokh.danylo.video_player_manager.manager.PlayerItemChangeListener;
import com.volokh.danylo.video_player_manager.manager.SingleVideoPlayerManager;
import com.volokh.danylo.video_player_manager.manager.VideoPlayerManager;
import com.volokh.danylo.video_player_manager.meta.MetaData;
import com.volokh.danylo.video_player_manager.ui.VideoPlayerView;

import java.util.HashMap;
import java.util.Stack;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Younes on 24/03/2017.
 */

public class NavigationActivity extends AppCompatActivity {

    public static final String TAG = "NavigationActivity";

    @Bind(R.id.toolbar) Toolbar mToolbar;
    @Bind(R.id.frame) FrameLayout mFrame;
    @Bind(R.id.bottomNavigation) AHBottomNavigation mNavigation;
    @Bind(R.id.toolbarTitle) TextView mTitleBar;
    @Bind(R.id.backButton) ImageButton mBackButton;

    private HashMap<Integer, Stack<BaseFragment>> mStacks;
    private BaseFragment[] fragments = new BaseFragment[AppConstants.NUMBER_FRAGMENTS];
    private String[] navigationItemText = new String[AppConstants.NUMBER_FRAGMENTS];

    private int mPosition;
    private Context mContext;


    private VideoPlayerManager<MetaData> mVideoPlayerManager = new SingleVideoPlayerManager(new PlayerItemChangeListener() {
        @Override
        public void onPlayerItemChanged(MetaData metaData) {

        }
    });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.navigation_layout);

        ButterKnife.bind(this);
        mContext = this;
        mPosition = 0;

        mStacks = new HashMap<Integer, Stack<BaseFragment>>();
        mStacks.put(AppConstants.HOME_FRAGMENT, new Stack<BaseFragment>());
        mStacks.put(AppConstants.DISCOVER_FRAGMENT, new Stack<BaseFragment>());
        mStacks.put(AppConstants.NOTIFICATION_FRAGMENT, new Stack<BaseFragment>());
        mStacks.put(AppConstants.PROFILE_FRAGMENT, new Stack<BaseFragment>());

        this.initToolbar();
        this.initItemText();
        this.initNavigationBar();
        this.initFragments();

        mBackButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                popFragments();
            }
        });

        pushFragments(mPosition, fragments[mPosition], false, true, mPosition);
        mTitleBar.setText(navigationItemText[mPosition]);

    }

    @Override
    protected void onResume() {
        super.onResume();
        mNavigation.setCurrentItem(mPosition);
        pushFragments(mPosition, mStacks.get(mPosition).lastElement(), false, false, mPosition);
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    private void initNavigationBar() {
        this.initIcons();
        mNavigation.setCurrentItem(mPosition);

        mNavigation.setDefaultBackgroundColor(Fetcher.fetchColor(this, R.color.white));
        mNavigation.setAccentColor(Fetcher.fetchColor(this, R.color.colorAccent));
        mNavigation.setTitleState(AHBottomNavigation.TitleState.ALWAYS_SHOW);

        mNavigation.setOnTabSelectedListener(new AHBottomNavigation.OnTabSelectedListener() {
            @Override
            public boolean onTabSelected(int position, boolean wasSelected) {
                if (position != mPosition && position != 2) {

                    if (position > 2) position -= 1;
                    if(mStacks.get(position).size() == 0) {
                        pushFragments(position, fragments[position], false, true, mPosition);
                    } else {
                        pushFragments(position, mStacks.get(position).lastElement(), false, false, mPosition);
                    }
                    Log.d(TAG, mStacks.get(position).lastElement().getToolbarTitle());
                    mTitleBar.setText(mStacks.get(position).lastElement().getToolbarTitle());
                    mPosition = position;
                } else if (position == 2) {
                    Intent intent = new Intent(mContext, CreateVideoActivity.class);
                    startActivity(intent);
                }

                return true;
            }
        });
    }

    private void initIcons() {
        AHBottomNavigationItem homeItem = new AHBottomNavigationItem(navigationItemText[AppConstants.HOME_FRAGMENT], R.drawable.ic_home);
        AHBottomNavigationItem discoverItem = new AHBottomNavigationItem(navigationItemText[AppConstants.DISCOVER_FRAGMENT], R.drawable.ic_search);
        AHBottomNavigationItem createItem = new AHBottomNavigationItem("", R.drawable.ic_video);
        AHBottomNavigationItem notificationsItem = new AHBottomNavigationItem(navigationItemText[AppConstants.NOTIFICATION_FRAGMENT], R.drawable.ic_notification);
        AHBottomNavigationItem profileItem = new AHBottomNavigationItem(navigationItemText[AppConstants.PROFILE_FRAGMENT], R.drawable.ic_profile);

        mNavigation.addItem(homeItem);
        mNavigation.addItem(discoverItem);
        mNavigation.addItem(createItem);
        mNavigation.addItem(notificationsItem);
        mNavigation.addItem(profileItem);
    }

    private void initFragments() {
        String username = getSharedPreferences(getString(R.string.sharedPreference), Context.MODE_PRIVATE).getString(getString(R.string.username), "");
        Log.d("NAVIGATION ACTIVITY", "username : " + username);
        fragments[AppConstants.HOME_FRAGMENT] = new HomeFragment();
        fragments[AppConstants.DISCOVER_FRAGMENT] = new DiscoverFragment();
        fragments[AppConstants.NOTIFICATION_FRAGMENT] = new NotificationsFragment();
        fragments[AppConstants.PROFILE_FRAGMENT] = new ProfileFragment();
        ((ProfileFragment)fragments[AppConstants.PROFILE_FRAGMENT]).setUsername(username);
    }

    private void initItemText() {
        navigationItemText[AppConstants.HOME_FRAGMENT] = Fetcher.fetchString(this, R.string.home);
        navigationItemText[AppConstants.DISCOVER_FRAGMENT] = Fetcher.fetchString(this, R.string.discover);
        navigationItemText[AppConstants.NOTIFICATION_FRAGMENT] = Fetcher.fetchString(this, R.string.notifications);
        navigationItemText[AppConstants.PROFILE_FRAGMENT] = Fetcher.fetchString(this, R.string.profile);
    }

    private void initToolbar() {
        //mTitleBar.setTypeface(Typeface.createFromAsset(getAssets(), "fonts/Bellota-BoldItalic.otf"));
        mTitleBar.setText(navigationItemText[mPosition]);
    }

    public void pushFragments(Integer position, BaseFragment fragment, boolean shouldAnimate, boolean shouldAdd, int oldPosition){

        FragmentManager manager = getSupportFragmentManager();
        FragmentTransaction ft = manager.beginTransaction();
        if(shouldAnimate)
            ft.setCustomAnimations(R.anim.enter, R.anim.exit);

        if(shouldAdd)
            mStacks.get(position).push(fragment);

        if (mStacks.get(position).size() == 1)
            mBackButton.setVisibility(View.GONE);
        else
            mBackButton.setVisibility(View.VISIBLE);

        if (fragment != mStacks.get(oldPosition).lastElement() ) {
            ft.hide(mStacks.get(oldPosition).lastElement());
        } else if (oldPosition == position && mStacks.get(oldPosition).size() > 1) {
            ft.hide(mStacks.get(oldPosition).get(mStacks.get(oldPosition).size() - 2));
        }

        if (fragment.isAdded()) {
            ft.show(fragment);
        } else {
            ft.add(R.id.frame, fragment);
        }

        ft.commit();
    }

    public void popFragments() {
        BaseFragment fragment = mStacks.get(mPosition).elementAt(mStacks.get(mPosition).size() - 2);

        FragmentManager manager = getSupportFragmentManager();
        FragmentTransaction ft = manager.beginTransaction();
        ft.remove(mStacks.get(mPosition).pop());
        ft.setCustomAnimations(R.anim.pop_exit, R.anim.pop_enter);
        if (mStacks.get(mPosition).size() == 1) {
            mBackButton.setVisibility(View.GONE);
        }
        ft.show(fragment);
        mTitleBar.setText(fragment.getToolbarTitle());
        ft.commit();
    }

    public void setCurrentTab(int val){
        mNavigation.setCurrentItem(val, true);
    }

    public void setToolbarTitle(String title) {
        mTitleBar.setText(title);
    }

    @Override
    public void onBackPressed() {
        if(mStacks.get(mPosition).size() == 1){
            finish();
            return;
        }

        mStacks.get(mPosition).lastElement().onBackPressed();

        popFragments();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if(mStacks.get(mPosition).size() == 0){
            return;
        }

        mStacks.get(mPosition).lastElement().onActivityResult(requestCode, resultCode, data);
    }

    public void pushNewFragment(View view) {
        if (view.getTag() != null && ((ClickEventData)view.getTag()).getClickEvent() == AppConstants.USERNAME_CLICK) {
            String username = ((ClickEventData)view.getTag()).getData();
            ProfileFragment fragment = new ProfileFragment();
            fragment.setUsername(username);
            pushFragments(mPosition, fragment, true, true, mPosition);
            mTitleBar.setText(fragment.getToolbarTitle());
            mBackButton.setVisibility(View.VISIBLE);
        }
    }

    public void playVideo(View view, String url) {
        mVideoPlayerManager.playNewVideo(null, (VideoPlayerView) view, url);
    }

}
