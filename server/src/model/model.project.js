import mongoose from 'mongoose';
const {Schema} = mongoose;

export default mongoose.model(
  'project',
  new Schema(
    {
      user_id: {type: String, default: ''},
      username: {type: String, default: ''},
      project_name: {type: String, default: ''},
      project_state: {type: Number, default: 1, comment: '1: has not started; 2: processing; 3: completed, 4: delay'},
      project_describe: {type: String, default: ''},
      project_begin_time: {type: String, default: ''},
      project_end_time: {type: String, default: ''},
      project_cycle: {type: Number, default: 1},
      project_people_list: {type: String, default: ''},
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
