package com.climb.eip.climb.adapters;

import android.content.Context;
import android.support.annotation.LayoutRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.VideoView;

import com.climb.eip.climb.R;
import com.climb.eip.climb.api.models.Video;

import org.w3c.dom.Text;

import java.util.List;

/**
 * Created by Younes on 24/03/2017.
 */

public class VideoListAdapter extends RecyclerView.Adapter {

    private Context mContext;
    private List<Video> mVideos;


    public VideoListAdapter(Context context, List<Video> videos) {
        mContext = context;
        mVideos = videos;
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

        public VideoView videoView;
        public ImageView videoThumbnail;
        public TextView videoLikes;
        public TextView videoViews;
        public TextView videoTitle;
        public TextView videoDescription;
        public TextView videoCategory;
        public TextView videoUsername;
        public ImageView videoLikeButton;


        public VideoHolder(View itemView) {
            super(itemView);

            videoView = (VideoView) itemView.findViewById(R.id.videoView);
            videoLikes = (TextView) itemView.findViewById(R.id.videoLikes);
            videoViews = (TextView) itemView.findViewById(R.id.videoViews);
            videoTitle = (TextView) itemView.findViewById(R.id.videoTitle);
            videoDescription = (TextView) itemView.findViewById(R.id.videoDescription);
            videoCategory = (TextView) itemView.findViewById(R.id.videoCategory);
            videoUsername = (TextView) itemView.findViewById(R.id.userUsername);


            videoThumbnail = (ImageView) itemView.findViewById(R.id.userVideoThumbnail);
            videoLikeButton = (ImageView) itemView.findViewById(R.id.likeButton);

        }

        public void bindViewHolder(Video video, int position) {
            setTextViews(video);
            setLikeButton(video, position);

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

            videoViews.setText(video.getViews() + " " + mContext.getResources().getString(R.string.views));
            setLikes(video);
        }
    }
}
