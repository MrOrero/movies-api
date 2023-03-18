import * as mongoose from 'mongoose';

export const MovieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        approved: {
            type: Boolean,
            required: true,
            default: false,
        },
        overview: {
            type: String,
            required: true,
        },
        releaseDate: {
            type: String,
        },
        ratings: [
            {
                rating: {
                    type: Number,
                    required: true,
                },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            },
        ],
    },
    { timestamps: true },
);
