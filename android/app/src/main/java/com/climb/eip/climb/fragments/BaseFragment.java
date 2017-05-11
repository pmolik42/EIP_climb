package com.climb.eip.climb.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.View;

import com.climb.eip.climb.activities.NavigationActivity;

/**
 * Created by Younes on 07/05/2017.
 */

public class BaseFragment extends Fragment implements View.OnClickListener {
    protected NavigationActivity mActivity;

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
        mActivity.pushNewFragment(view);
    }
}
