package com.v_ring.sizing_video_player;

import android.app.ProgressDialog;
//import android.media.session.MediaController;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.VideoView;
import android.widget.MediaController;

public class Sizing_video_view_Activity extends AppCompatActivity {

    ProgressDialog  pDialog;
    VideoView       videoview;

    String VideoURL = "http://www.androidbegin.com/tutorial/AndroidCommercial.3gp";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sizing_video_view_);

        videoview = (VideoView) findViewById(R.id.VideoView);

        pDialog = new ProgressDialog(Sizing_video_view_Activity.this);

        pDialog.setTitle("Android Video Streaming Tutorial");

        pDialog.setMessage("Buffering...");
        pDialog.setIndeterminate(false);
        pDialog.setCancelable(false);

        pDialog.show();

        try {
            MediaController mediaController = new MediaController(Sizing_video_view_Activity.this);

            mediaController.setAnchorView(videoview);
            Uri video = Uri.parse(VideoURL);
            videoview.setMediaController(mediaController);
            videoview.setVideoURI(video);

            }   catch (Exception e) {
                    // TODO: handle exception
                    Log.e("Error", e.getMessage());
                    e.printStackTrace();
        }

        videoview.requestFocus();
        videoview.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
            @Override
            public void onPrepared(MediaPlayer mp) {
                pDialog.dismiss();
                videoview.start();
            }
        });

        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });
    }

}
