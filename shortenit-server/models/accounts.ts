import mongoose, {Schema, Document} from 'mongoose';

export interface IAccount extends Document {
    userName: string;
    password: string;
    createdOn: Date;
    updatedOn: Date;
}

export interface ICreateToken extends Document {
    userName: string;
    password: string;
}

const accountSchema = new Schema<IAccount>({
        userName: {
            type: String,
            require: true,
            index: true,
            unique: true
        },
        password: { // point to object id?
            type: String,
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

const Account = mongoose.model<IAccount>('Account', accountSchema);

export default Account;
