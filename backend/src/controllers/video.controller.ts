import { Request, Response } from "express";
import { processVideoForHLS } from "../services/video.service";
import fs from "fs";

export const uploadVideoController = async  (req: Request, res: Response) => {
    if(!req.file){
        res.status(400).json({
            success: false,
            message: "No files uploaded"
        })
        return;
    }

    const videoPath = req.file.path;
    const outputPath = `output/${Date.now()}`;

    processVideoForHLS(videoPath, outputPath, (err, _masterPlaylistPath) => {
        if(err){
            res.status(500).json({
                seccess: false,
                message: "An error occure while processing the video"
            });
            return;
        }

        //deleting the video
        fs.unlink(videoPath, (err) => {
            if(err){
                console.log("An error occure while deleting the video", err);
            }
        })
    });
    res.status(200).json({
        success:true,
        message: "file uploaded successfully",
    })

}



