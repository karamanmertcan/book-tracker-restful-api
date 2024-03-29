import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: [validateEmail, 'Please fill a valid email address'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64
    },
    totalPage: {
      type: Number,
      default: 0
    },
    lastWeekPage: {
      type: Number,
      default: 0
    },
    readPages: [
      {
        pageNumber: {
          type: Number,
          required: true
        },
        bookId: {
          type: ObjectId,
          ref: 'Book'
        },
        date: {
          type: Date,
          default: Date.now
        },
        createdBy: {
          type: ObjectId,
          ref: 'User'
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model('User', userSchema);
