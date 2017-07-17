package com.climb.eip.climb.activities;

import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.climb.eip.climb.R;
import com.climb.eip.climb.bus.BusProvider;
import com.climb.eip.climb.manager.ClimbManager;
import com.squareup.otto.Bus;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Younes on 21/05/2017.
 */

public class CreateVideoActivity extends AppCompatActivity {

    public static final String TAG = "CreateVideoActivity";
    public static final int REQUEST_TAKE_GALLERY_VIDEO = 0;

    @Bind(R.id.path) TextView path;

    @Bind(R.id.videoTitle) EditText videoTitle;
    @Bind(R.id.videoDescription) EditText videoDescription;

    @Bind(R.id.upload) Button upload;
    @Bind(R.id.browseGallery) Button browseVideos;

    private ClimbManager mClimbManager;
    private Bus mBus = BusProvider.getInstance();

    private Context mContext;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.create_video_layout);
        mContext = this;
        mClimbManager = new ClimbManager(this, mBus);


        ButterKnife.bind(this);

        browseVideos.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent();
                intent.setType("video/*");
                intent.setAction(Intent.ACTION_GET_CONTENT);
                startActivityForResult(Intent.createChooser(intent,"Select Video"), REQUEST_TAKE_GALLERY_VIDEO);
            }
        });

        upload.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });

    }

    @Override
    protected void onResume() {
        super.onResume();
        mBus.register(this);
        mBus.register(mClimbManager);
    }

    @Override
    protected void onStop() {
        mBus.unregister(this);
        mBus.unregister(mClimbManager);
        super.onStop();
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode == RESULT_OK) {
            if (requestCode == REQUEST_TAKE_GALLERY_VIDEO) {
                Uri selectedImageUri = data.getData();

                // MEDIA GALLERY
                String selectedImagePath = selectedImageUri.getPath();
                if (selectedImagePath != null) {
                    path.setText(selectedImagePath);

                }
            }
        }
    }

    public String getPath(Uri uri) {
        String[] projection = { MediaStore.Video.Media.DATA };
        Cursor cursor = managedQuery(uri, projection, null, null, null);
        if (cursor != null) {
            // HERE YOU WILL GET A NULLPOINTER IF CURSOR IS NULL
            // THIS CAN BE, IF YOU USED OI FILE MANAGER FOR PICKING THE MEDIA
            int column_index = cursor
                    .getColumnIndexOrThrow(MediaStore.Video.Media.DATA);
            cursor.moveToFirst();
            return cursor.getString(column_index);
        } else
            return null;
    }

}
