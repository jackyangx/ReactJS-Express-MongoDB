import mongoose from 'mongoose';
const {Schema} = mongoose;

// has not started
// processing
// completed

export default mongoose.model(
  'task',
  new Schema(
    {
      own_id: {type: String, default: ''},
      own_username: {type: String, default: ''},
      project_id: {type: String, default: ''},
      project_name: {type: String, default: ''},
      task_user_id: {type: String, default: ''},
      task_username: {type: String, default: ''},
      task_name: {type: String, default: ''},
      task_begin_time: {type: String, default: ''},
      task_end_time: {type: String, default: ''},
      task_state: {type: Number, default: 1, comment: '1: has not started; 2: processing; 3: completed, 4: delay'},
      task_describe: {type: String, default: ''},
      create_time: {type: Number, default: Date.now()},
    },
    {
      timestamps: {createdAt: 'create_time', updatedAt: 'update_time'},
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
