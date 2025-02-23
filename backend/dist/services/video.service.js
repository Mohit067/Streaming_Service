"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processVideoForHLS = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const fs_1 = __importDefault(require("fs"));
const movie_repositiore_1 = require("../repositories/movie.repositiore");
const resolutions = [
    { width: 1920, height: 1080, bitRate: 4500 }, // 1080p (Full HD)
    { width: 1280, height: 720, bitRate: 2500 }, // 720p (HD)
    { width: 854, height: 480, bitRate: 1000 }, // 480p (SD)
    { width: 640, height: 360, bitRate: 700 }, // 360p
    { width: 426, height: 240, bitRate: 400 }, // 240p
];
const processVideoForHLS = (inputPath, outputPath, callback) => {
    fs_1.default.mkdirSync(outputPath, { recursive: true }); //create a output directory
    (0, movie_repositiore_1.createMoie)(outputPath);
    const masterPlaylist = `${outputPath}/master.m3u8`; //path to the master playlist
    const masterContent = [];
    let countProcessing = 0;
    resolutions.forEach((resolution) => {
        const variantOutput = `${outputPath}/${resolution.height}p`;
        const variantPlayList = `${variantOutput}/playlist.m3u8`;
        fs_1.default.mkdirSync(variantOutput, { recursive: true }); // create varient directory
        (0, fluent_ffmpeg_1.default)(inputPath)
            .outputOption([
            `-vf scale=${resolution.width}:${resolution.height}`, // Scaling
            `-b:v ${resolution.bitRate}k`, // Bitrate
            `-c:v libx264`, //  codec option
            `-c:a aac`, //  codec option
            `-hls_time 10`,
            `-hls_playlist_type vod`,
            `-hls_segment_filename ${variantOutput}/segment%03d.ts`
        ])
            .output(variantPlayList) //output to the varient playlist fie
            .on('end', () => {
            //when the processing ends for a resolution, add the varient playlist to the master
            masterContent.push(`#EXT-X-STREAM-INF:BANDWIDTH=${resolution.bitRate * 1000},RESOLUTION=${resolution.width}x${resolution.height}\n${resolution.height}p/playlist.m3u8`);
            countProcessing += 1;
            if (countProcessing === resolutions.length) {
                console.log("processing complete");
                console.log(masterContent);
                // when the processing ends for all resolutions, create master playlist
                fs_1.default.writeFileSync(masterPlaylist, `#EXTM3U\n${masterContent.join('\n')}`);
                // place where the video processing end;
                (0, movie_repositiore_1.updateMovieStatus)(outputPath, "COMPLETED");
                callback(null, masterPlaylist); // call the callback with the master playlist
            }
        })
            .on('error', (error) => {
            console.log("an error occurred", error);
            callback(error); //call the callback with the error
        })
            .run();
    });
};
exports.processVideoForHLS = processVideoForHLS;
