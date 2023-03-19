import * as mongoose from 'mongoose';

export const MovieSchema = new mongoose.Schema(
    {
        creator: {},
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
        status: [
            {
                status: {
                    type: String,
                    enum: [
                        'WATCHED',
                        'NOT WATCHED',
                        'WATCHING',
                        'DROPPED',
                        'WANT TO WATCH',
                        "WON'T WATCH",
                    ],
                    default: 'NOT WATCHED',
                },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            },
        ],
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
