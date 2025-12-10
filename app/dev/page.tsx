'use client';

import { useEffect, useRef } from 'react';
import flvjs from 'flv.js';

export default function DevPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    let flvPlayer: flvjs.Player | null = null;

    if (flvjs.isSupported()) {
      flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: 'http://116.205.183.125:2022/live/van.flv',
        isLive: true,
        hasAudio: true,
      });

      flvPlayer.attachMediaElement(videoRef.current);
      flvPlayer.load();
      flvPlayer.play().catch(err => {
        console.error('播放失败:', err);
      });
    }

    return () => {
      if (flvPlayer) {
        flvPlayer.destroy();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <h1 className="text-white mb-4 text-xl font-bold">FLV 直播测试</h1>
      <div className="w-full max-w-4xl aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          controls
          autoPlay
          muted // 自动播放通常需要静音
        />
      </div>
      <p className="text-gray-400 mt-4 text-sm">
        流地址: http://116.205.183.125:2022/live/van.flv
      </p>
    </div>
  );
}
