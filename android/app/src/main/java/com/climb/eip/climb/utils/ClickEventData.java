package com.climb.eip.climb.utils;

/**
 * Created by Younes on 07/05/2017.
 */

public class ClickEventData {

    private int clickEvent;
    private String data;

    public ClickEventData(int clickEvent, String data) {
        this.clickEvent = clickEvent;
        this.data = data;
    }

    public int getClickEvent() {
        return clickEvent;
    }

    public void setClickEvent(int clickEvent) {
        this.clickEvent = clickEvent;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
