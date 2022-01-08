import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const quoteSchema = new Schema(
  {
    quote: {
      type: String,
      required: true,
      trim: true
    },
    bookOwnerId: {
      type: ObjectId,
      ref: 'User'
    },
    bookName: {
      type: String,
      required: true,
      trim: true
    },
    bookId: {
      type: ObjectId,
      ref: 'Book'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Quote', quoteSchema);
