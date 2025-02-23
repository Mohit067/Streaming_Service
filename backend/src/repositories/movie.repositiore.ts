import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createMoie = async(movieId: string) => {
    const response = await prisma.movie.create({
        data: {
            movieId,
            processingStatus: "pending"
        }
    });
    return response;
}

export const updateMovieStatus = async(movieId: string, status: string) => {
    const response = await prisma.movie.update({
        where: {
            movieId,
        },
        data: {
            processingStatus: status
        }
    });
    return response;
}