import mongoose from 'mongoose';

export interface IrefreshTokensStoreItem {
  userId: string;
  token: string;
  sessionStart: number;
  expiresAt: number;
}

// An interface that describes the properties
// that are requried to create a new User
interface IUser {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: IUser): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  refreshTokens: IrefreshTokensStoreItem[];
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Number,
      required: false,
    },
    refreshTokens: {
      type: [
        {
          token: { type: String, required: true },
          userId: { type: String, required: true },
          sessionStart: { type: Number, required: true },
          expiresAt: { type: Number, required: true },
        },
      ],
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attrs: IUser) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
