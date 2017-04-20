package com.climb.eip.climb.utils;

import android.content.Context;
import android.support.annotation.ColorRes;
import android.support.v4.content.ContextCompat;

/**
 * Created by Younes on 22/03/2017.
 */

public class Fetcher {
    private static final Fetcher fetcher = new Fetcher();

    public static Fetcher getInstance() {
        return fetcher;
    }

    public static String fetchString(Context context, int resourceId) {
        return context.getResources().getString(resourceId);
    }

    public static int fetchColor(Context context, @ColorRes int color) {
        return ContextCompat.getColor(context, color);
    }

    private Fetcher() {
    }
}
