import mongoose from 'mongoose';
const {Schema} = mongoose;

export default mongoose.model(
  'user',
  new Schema(
    {
      username: {type: String, default: ''},
      password: {type: String, default: ''},
      email: {type: String, default: ''},
      salt: {type: String, default: ''},
      mobile: {type: String, default: ''},
      create_time: {type: Number, default: Date.now()},
    },
    {
      timestamps: {updatedAt: 'update_time'},
      toJSON: {
        virtuals: true,
        transform(doc, ret) {
          delete ret.__v;
          delete ret._id;
          return ret;
        },
      },
    },
  ),
);
