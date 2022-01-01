import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const bookSchema = new Schema(
  {
    bookName: {
      type: String,
      required: true
    },
    bookOwner: {
      type: ObjectId,
      required: true,
      ref: 'User'
    },
    bookAuthor: {
      type: String,
      required: true
    },
    readPages: [
      {
        pageNumber: {
          type: Number,
          required: true
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

export default mongoose.model('Book', bookSchema);
