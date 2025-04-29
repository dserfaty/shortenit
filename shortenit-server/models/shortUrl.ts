import mongoose, {Schema, Document} from 'mongoose';

export interface IShortUrl extends Document {
    url: string;
    uid: string | null;
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

shortUrlSchema.index({uid: 1, url: 1}, {unique: true});
// shortUrlSchema.index({ createdOn: 1 });

const ShortUrl = mongoose.model<IShortUrl>('ShortUrl', shortUrlSchema);

export default ShortUrl;
