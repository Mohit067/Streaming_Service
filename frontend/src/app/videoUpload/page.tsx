"use client"
import axios from "axios";
import { ChangeEvent } from "react";

const VideoUpload = () => {

    const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(!file){
            console.error("No file selected");
            return;
        }
        console.log(file);
        try {
            const formData = new FormData();
            formData.append("video", file);
            const response = await axios.post(
                'http://localhost:3000/api/v1/videos/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log(response.data);
        } catch (error) {
            console.log("something went wrong", error)
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center py-12 px-6">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Upload a Video</h2>
                
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleUpload}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-5 
                    file:rounded-lg file:border-0 file:text-sm file:font-medium 
                    file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer transition"
                />
                
                <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300">
                    Upload
                </button>
            </div>
        </div>
    );
};

export default VideoUpload;
