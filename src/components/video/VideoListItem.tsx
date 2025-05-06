
import React from 'react';
import { Eye, User, Calendar, ThumbsUp } from 'lucide-react';
import { VideoData } from './types';
import { formatNumber } from './utils';

interface VideoListItemProps {
  video: VideoData;
}

const VideoListItem: React.FC<VideoListItemProps> = ({ video }) => {
  // URL para o vídeo no YouTube
  const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
  
  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <img 
        src={video.thumbnail} 
        alt={video.title} 
        className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex flex-col flex-grow overflow-hidden">
        <div className="flex justify-between">
          <h3 className="font-medium line-clamp-1">
            <a 
              href={videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-brand-500 transition-colors"
            >
              {video.title}
            </a>
          </h3>
          {video.isShort && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              Short
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-2">{video.channelTitle}</p>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{video.description}</p>
        
        <div className="flex gap-4 text-sm mt-auto">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye size={14} />
            <span>{formatNumber(video.viewCount)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <ThumbsUp size={14} />
            <span>{formatNumber(video.likeCount)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <User size={14} />
            <span>{formatNumber(video.subscriberCount)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar size={14} />
            <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoListItem;
