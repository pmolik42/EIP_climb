package com.climb.eip.climb.activities;

import android.content.Context;
import android.graphics.Typeface;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.widget.FrameLayout;
import android.widget.TextView;

import com.aurelhubert.ahbottomnavigation.AHBottomNavigation;
import com.aurelhubert.ahbottomnavigation.AHBottomNavigationItem;
import com.climb.eip.climb.R;
import com.climb.eip.climb.fragments.HomeFragment;
import com.climb.eip.climb.fragments.ProfileFragment;
import com.climb.eip.climb.realm.RealmUser;
import com.climb.eip.climb.utils.Fetcher;

import butterknife.Bind;
import butterknife.ButterKnife;
import io.realm.Realm;
import io.realm.RealmQuery;

/**
 * Created by Younes on 24/03/2017.
 */

public class NavigationActivity extends AppCompatActivity {

    private static final int HOME_FRAGMENT = 0;
    //private static final int GOALS_FRAGMENT = 1;
    //private static final int CREATE_GOAL_FRAGMENT = 2;
    //private static final int ACHIEVEMENTS_FRAGMENT = 3;
    private static final int PROFILE_FRAGMENT = 1;
    private static final int NUMBER_FRAGMENTS = 2;

    @Bind(R.id.toolbar) Toolbar mToolbar;
    @Bind(R.id.frame) FrameLayout mFrame;
    @Bind(R.id.bottomNavigation) AHBottomNavigation mNavigation;
    @Bind(R.id.toolbarTitle) TextView mTitleBar;

    private Fragment[] fragments = new Fragment[NUMBER_FRAGMENTS];
    private String[] navigationItemText = new String[NUMBER_FRAGMENTS];
    private static final String appName = "Climb";

    private int mPosition;
    private Realm realm = Realm.getDefaultInstance();
    private Context mContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.navigation_layout);

        ButterKnife.bind(this);
        mContext = this;

        mPosition = 0;

        this.initToolbar();
        this.initItemText();
        this.initNavigationBar();
        this.initFragments();

        this.handleFragmentNavigation(R.id.frame, fragments[HOME_FRAGMENT], mPosition);

    }

    @Override
    protected void onResume() {
        super.onResume();
        mNavigation.setCurrentItem(mPosition);
        this.handleFragmentNavigation(R.id.frame, fragments[mPosition], mPosition);
    }

    private void initNavigationBar() {
        this.initIcons();
        mNavigation.setCurrentItem(mPosition);

        mNavigation.setDefaultBackgroundColor(Fetcher.fetchColor(this, R.color.white));
        mNavigation.setAccentColor(Fetcher.fetchColor(this, R.color.colorPrimaryDark));
        mNavigation.setTitleState(AHBottomNavigation.TitleState.ALWAYS_SHOW);

        mNavigation.setOnTabSelectedListener(new AHBottomNavigation.OnTabSelectedListener() {
            @Override
            public boolean onTabSelected(int position, boolean wasSelected) {
                if (position != mPosition) {

                    mTitleBar.setText(navigationItemText[position]);
                    handleFragmentNavigation(R.id.frame, fragments[position], mPosition);
                }

                mPosition = position;

                return true;
            }
        });
    }

    private void initIcons() {
        AHBottomNavigationItem homeItem = new AHBottomNavigationItem(navigationItemText[HOME_FRAGMENT], R.drawable.ic_home);
        //AHBottomNavigationItem goalsItem = new AHBottomNavigationItem(navigationItemText[GOALS_FRAGMENT], R.drawable.ic_goals);
        //AHBottomNavigationItem createItem = new AHBottomNavigationItem("", R.drawable.ic_create);
        //AHBottomNavigationItem achievementsItem = new AHBottomNavigationItem(navigationItemText[ACHIEVEMENTS_FRAGMENT], R.drawable.ic_success);
        AHBottomNavigationItem settingsItem = new AHBottomNavigationItem(navigationItemText[PROFILE_FRAGMENT], R.drawable.ic_profile);

        mNavigation.addItem(homeItem);
        //mNavigation.addItem(goalsItem);
        //mNavigation.addItem(createItem);
        //mNavigation.addItem(achievementsItem);
        mNavigation.addItem(settingsItem);
    }

    private void initFragments() {
        RealmQuery<RealmUser> query = realm.where(RealmUser.class);
        RealmUser user = query.findFirst();
        fragments[HOME_FRAGMENT] = new HomeFragment();
        //fragments[GOALS_FRAGMENT] = new GoalsFragment();
        //fragments[CREATE_GOAL_FRAGMENT] = new CreateGoalFragment();
        //fragments[ACHIEVEMENTS_FRAGMENT] = new AchievementsFragment();
        fragments[PROFILE_FRAGMENT] = new ProfileFragment();
        ((ProfileFragment)fragments[PROFILE_FRAGMENT]).setUsername(user.getUsername());
    }

    private void initItemText() {
        navigationItemText[HOME_FRAGMENT] = Fetcher.fetchString(this, R.string.home);
        //navigationItemText[GOALS_FRAGMENT] = Fetcher.fetchString(this, R.string.goals);
        //navigationItemText[CREATE_GOAL_FRAGMENT] = Fetcher.fetchString(this, R.string.create);;
        //navigationItemText[ACHIEVEMENTS_FRAGMENT] = Fetcher.fetchString(this, R.string.achievements);
        navigationItemText[PROFILE_FRAGMENT] = Fetcher.fetchString(this, R.string.profile);
    }

    private void initToolbar() {
        //mTitleBar.setTypeface(Typeface.createFromAsset(getAssets(), "fonts/Bellota-BoldItalic.otf"));
        mTitleBar.setText(navigationItemText[mPosition]);
    }

    private void handleFragmentNavigation(int id, Fragment fragment, int oldPosition) {
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();

        if (fragment != fragments[oldPosition])
            transaction.hide(fragments[oldPosition]);

        if (fragment.isAdded()) {
            transaction.show(fragment);
        } else {
            transaction.add(id, fragment);
        }

        transaction.commit();
    }

    public void setToolbarTitle(String title) {
        mTitleBar.setText(title);
    }


}
