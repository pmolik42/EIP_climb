package com.climb.eip.climb.adapters;

import android.content.Context;
import android.support.annotation.LayoutRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.VideoView;

import com.android.volley.VolleyError;
import com.android.volley.toolbox.ImageLoader;
import com.climb.eip.climb.AppController;
import com.climb.eip.climb.R;
import com.climb.eip.climb.api.models.Video;
import com.climb.eip.climb.utils.AppConstants;
import com.climb.eip.climb.utils.ClickEventData;
import com.mikhaellopez.circularimageview.CircularImageView;
import com.squareup.picasso.Picasso;
import com.volokh.danylo.video_player_manager.manager.PlayerItemChangeListener;
import com.volokh.danylo.video_player_manager.manager.SingleVideoPlayerManager;
import com.volokh.danylo.video_player_manager.manager.VideoPlayerManager;
import com.volokh.danylo.video_player_manager.meta.MetaData;
import com.volokh.danylo.video_player_manager.ui.MediaPlayerWrapper;
import com.volokh.danylo.video_player_manager.ui.SimpleMainThreadMediaPlayerListener;
import com.volokh.danylo.video_player_manager.ui.VideoPlayerView;

import org.w3c.dom.Text;

import java.util.List;

/**
 * Created by Younes on 24/03/2017.
 */

public class VideoListAdapter extends RecyclerView.Adapter {

    public static final String TAG = "VideoListAdapter";
    private Context mContext;
    private List<Video> mVideos;
    private View.OnClickListener mClickListener;


    public VideoListAdapter(Context context, List<Video> videos, View.OnClickListener clickListener) {
        mContext = context;
        mVideos = videos;
        mClickListener = clickListener;
    }

    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        mContext = parent.getContext();
        final View view = LayoutInflater.from(mContext).inflate(viewType, parent, false);
        return new VideoHolder(view);
    }

    @Override
    public void onBindViewHolder(RecyclerView.ViewHolder holder, int position) {
        ((VideoHolder)holder).bindViewHolder(mVideos.get(position), position);
    }

    @Override
    public int getItemCount() {
        return mVideos.size();
    }

    @Override
    public int getItemViewType(int position) {
        return R.layout.item_video;
    }

    public class VideoHolder extends RecyclerView.ViewHolder {

        public VideoPlayerView videoView;
        public ImageView videoThumbnail;
        public TextView videoLikes;
        public TextView videoComments;
        public TextView videoTitle;
        public TextView videoDescription;
        public TextView videoCategory;
        public TextView videoUsername;
        public CircularImageView userImageView;
        public ImageView videoLikeButton;
        public ProgressBar videoPictureProgress;
        public ProgressBar userPictureProgress;
        public ImageButton videoPlay;


        public VideoHolder(View itemView) {
            super(itemView);

            videoPlay = (ImageButton) itemView.findViewById(R.id.playVideoButton);

            videoView = (VideoPlayerView) itemView.findViewById(R.id.videoView);
            videoLikes = (TextView) itemView.findViewById(R.id.videoLikes);
            videoComments = (TextView) itemView.findViewById(R.id.videoComments);
            videoTitle = (TextView) itemView.findViewById(R.id.videoTitle);
            videoDescription = (TextView) itemView.findViewById(R.id.videoDescription);
            videoCategory = (TextView) itemView.findViewById(R.id.videoCategory);
            videoUsername = (TextView) itemView.findViewById(R.id.userUsername);

            videoPictureProgress = (ProgressBar) itemView.findViewById(R.id.videoImageProgress);
            userPictureProgress = (ProgressBar) itemView.findViewById(R.id.userImageProgress);

            videoThumbnail = (ImageView) itemView.findViewById(R.id.userVideoThumbnail);
            videoLikeButton = (ImageView) itemView.findViewById(R.id.likeButton);
            userImageView = (CircularImageView) itemView.findViewById(R.id.userProfilePicture);

        }

        public void bindViewHolder(final Video video, int position) {
            setTextViews(video);
            setLikeButton(video, position);
            videoPlay.setVisibility(View.INVISIBLE);
            videoPlay.setEnabled(false);
            videoPictureProgress.setVisibility(View.VISIBLE);
            userPictureProgress.setVisibility(View.VISIBLE);
            videoThumbnail.setVisibility(View.INVISIBLE);
            userImageView.setVisibility(View.INVISIBLE);

            Picasso.with(mContext).load(video.getThumbnailVideo()).into(videoThumbnail);
            videoPictureProgress.setVisibility(View.GONE);
            videoPlay.setEnabled(true);
            videoPlay.setVisibility(View.VISIBLE);
            videoThumbnail.setVisibility(View.VISIBLE);

            Picasso.with(mContext).load(video.getOwnerProfilePicture()).fit().into(userImageView);
            userImageView.setTag(new ClickEventData(AppConstants.USERNAME_CLICK, video.getOwnerUsername()));
            userImageView.setOnClickListener(mClickListener);

            userPictureProgress.setVisibility(View.INVISIBLE);
            userImageView.setVisibility(View.VISIBLE);
            videoView.setTag(new ClickEventData(AppConstants.VIDEO_PLAY_CLICK, video.getUrl().replace("localhost", "10.0.2.2")));
            videoView.addMediaPlayerListener(new SimpleMainThreadMediaPlayerListener() {
                @Override
                public void onVideoPreparedMainThread() {
                    // We hide the cover when video is prepared. Playback is about to start
                    videoPlay.setVisibility(View.INVISIBLE);
                    videoThumbnail.setVisibility(View.INVISIBLE);
                }

                @Override
                public void onVideoStoppedMainThread() {
                    // We show the cover when video is stopped
                    videoPlay.setVisibility(View.VISIBLE);

                }

                @Override
                public void onVideoCompletionMainThread() {
                    // We show the cover when video is completed
                    videoPlay.setVisibility(View.VISIBLE);
                    videoThumbnail.setVisibility(View.VISIBLE);

                }
            });
            videoPlay.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Log.d(TAG, "video play clicked");
                    mClickListener.onClick(videoView);
                }
            });

        }

        private void setLikeButton(final Video video, final int position) {
            if (video.isLiked()) {
                videoLikeButton.setImageResource(R.drawable.ic_liked);
            } else {
                videoLikeButton.setImageResource(R.drawable.ic_not_liked);
            }

            videoLikeButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Video currentVideo = mVideos.get(getAdapterPosition());
                    if (currentVideo.isLiked()) {
                        videoLikeButton.setImageResource(R.drawable.ic_not_liked);
                        currentVideo.setLikes(currentVideo.getLikes() - 1);
                        currentVideo.setLiked(false);
                    } else {
                        videoLikeButton.setImageResource(R.drawable.ic_liked);
                        currentVideo.setLikes(video.getLikes() + 1);
                        currentVideo.setLiked(true);
                    }
                    setLikes(currentVideo);
                }
            });
        }

        private void setLikes(final Video video) {
            videoLikes.setText(video.getLikes() + " " + mContext.getResources().getString(R.string.likes));
        }

        private void setTextViews(final Video video) {
            videoTitle.setText(video.getTitle());
            videoDescription.setText(video.getDescription());
            videoCategory.setText(video.getCategory());
            videoUsername.setText(video.getOwnerUsername());

            videoUsername.setTag(new ClickEventData(AppConstants.USERNAME_CLICK, video.getOwnerUsername()));
            videoUsername.setOnClickListener(mClickListener);

            videoComments.setText(video.getComments() + " " + mContext.getResources().getString(R.string.comments));
            setLikes(video);
        }
    }
}
