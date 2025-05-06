
import React from 'react';
import { Eye, User, Calendar, ThumbsUp } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { VideoData } from './types';
import { formatNumber } from './utils';

interface VideoCardProps {
  video: VideoData;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  // URL para o vídeo no YouTube
  const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
  
  return (
    <Card className="video-card card-hover">
      <div className="relative">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full aspect-video object-cover"
        />
        {video.isShort && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Short
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-base line-clamp-2 mb-1">
          <a 
            href={videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-brand-500 transition-colors"
          >
            {video.title}
          </a>
        </h3>
        <p className="text-muted-foreground text-sm mb-3">{video.channelTitle}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Eye size={14} />
            <span>{formatNumber(video.viewCount)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ThumbsUp size={14} />
            <span>{formatNumber(video.likeCount)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User size={14} />
            <span>{formatNumber(video.subscriberCount)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar size={14} />
            <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;
