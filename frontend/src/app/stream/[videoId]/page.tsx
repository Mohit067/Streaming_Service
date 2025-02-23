"use client"
import Hls from "hls.js";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {

    const param = useParams<{ videoId: string }>();
    const videoId = param.videoId;

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if(videoId && Hls.isSupported()){
            const hls = new Hls();
            console.log(hls)
            hls.loadSource(`http://localhost:3000/output/${videoId}/master.m3u8`);
            hls.attachMedia(videoRef.current!);
        }
    }, [videoId])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center justify-center py-12 px-6">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-lg border border-gray-300">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Video Streaming {videoId}</h2>
                <video 
                    controls
                    className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    ref={videoRef}
                    width={'100%'}
                />
            </div>
        </div>
    );
    
}
