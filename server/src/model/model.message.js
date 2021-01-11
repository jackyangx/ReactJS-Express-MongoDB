import mongoose from 'mongoose';
const {Schema} = mongoose;

export default mongoose.model(
  'message',
  new Schema(
    {
      project_id: {type: String, default: ''},
      user_id: {type: String, default: ''},
      username: {type: String, default: ''},
      content: {type: String, default: ''},
      create_time: {type: Number, default: Date.now},
    },
    {
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
