import mongoose, {Schema, Document} from 'mongoose';

export interface IShortUrl extends Document {
    url: string;
    uid: string | null;
    slug: string,
    visits: number;
    createdOn: Date;
    updatedOn: Date;
}

const shortUrlSchema = new Schema<IShortUrl>({
        url: {
            type: String,
            require: true,
            index: true
        },
        uid: { // point to object id?
            type: String,
            require: true,
            index: true
        },
        slug: {
            type: String,
            require: true,
            index: true,
            unique: true,
        },
        visits: {
            type: Number,
            require: true
        },
        createdOn: {
            type: Date,
            require: true,
            index: true
        },
        updatedOn: {
            type: Date,
            require: true
        }
    }
)

// The combination of uid | url is unique but also allows anonymous urls (uid = null) in case we want it
shortUrlSchema.index({uid: 1, url: 1}, {unique: true});

// We want to be able to sort fast on uid | visits | created on
shortUrlSchema.index({uid: 1, visits: 1}, {unique: false});
shortUrlSchema.index({uid: 1, visits: 1, createdOn: 1}, {unique: false});

// shortUrlSchema.index({ createdOn: 1 });

const ShortUrl = mongoose.model<IShortUrl>('ShortUrl', shortUrlSchema);

export default ShortUrl;
