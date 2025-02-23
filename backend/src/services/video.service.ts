import ffmpeg from 'fluent-ffmpeg';

import fs from 'fs'
import { createMoie, updateMovieStatus } from '../repositories/movie.repositiore';

interface Resolution {
    height: number;
    width: number;
    bitRate: number;
}

const resolutions: Resolution[] = [

    { width: 1920, height: 1080, bitRate: 4500 },  // 1080p (Full HD)
    { width: 1280, height: 720, bitRate: 2500 },   // 720p (HD)
    { width: 854, height: 480, bitRate: 1000 },    // 480p (SD)
    { width: 640, height: 360, bitRate: 700 },     // 360p
    { width: 426, height: 240, bitRate: 400 },     // 240p
    
];

export const processVideoForHLS = (
    inputPath: string,
    outputPath: string,
    callback: (error: Error | null, masterPlaylist?: string) => void
) : void => {
    fs.mkdirSync(outputPath, { recursive: true}); //create a output directory
    createMoie(outputPath);

    const masterPlaylist = `${outputPath}/master.m3u8`; //path to the master playlist

    const masterContent: string[]= [];

    let countProcessing = 0;

    resolutions.forEach((resolution) => {
        const variantOutput = `${outputPath}/${resolution.height}p`;
        const variantPlayList = `${variantOutput}/playlist.m3u8`;

        fs.mkdirSync(variantOutput, {recursive: true});// create varient directory

        ffmpeg(inputPath)
        .outputOption([
            `-vf scale=${resolution.width}:${resolution.height}`, // Scaling
            `-b:v ${resolution.bitRate}k`,  // Bitrate
            `-c:v libx264`, //  codec option
            `-c:a aac`, //  codec option
            `-hls_time 10`,
            `-hls_playlist_type vod`,
            `-hls_segment_filename ${variantOutput}/segment%03d.ts`
        ])
        
            .output(variantPlayList)//output to the varient playlist fie
            .on('end', () => {
                //when the processing ends for a resolution, add the varient playlist to the master
                masterContent.push(
                    `#EXT-X-STREAM-INF:BANDWIDTH=${resolution.bitRate*1000},RESOLUTION=${resolution.width}x${resolution.height}\n${resolution.height}p/playlist.m3u8`
                );
                countProcessing += 1;
                if(countProcessing === resolutions.length) {
                    console.log("processing complete");
                    console.log(masterContent);
                    // when the processing ends for all resolutions, create master playlist
                    fs.writeFileSync(masterPlaylist, `#EXTM3U\n${masterContent.join('\n')}`);
                    // place where the video processing end;
                    updateMovieStatus(outputPath, "COMPLETED");
                    callback(null, masterPlaylist)// call the callback with the master playlist
                }
            })
            .on('error',(error) => {
                console.log("an error occurred", error);
                callback(error);//call the callback with the error
            })
            .run();
    });
}
  