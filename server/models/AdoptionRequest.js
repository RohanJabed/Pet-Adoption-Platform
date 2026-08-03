import mongoose from 'mongoose';

const adoptionRequestSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    petName: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    requesterName: {
      type: String,
      required: true,
    },
    requesterEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    pickupDate: {
      type: Date,
      required: [true, 'Please select a pickup date'],
    },
    message: {
      type: String,
      required: [true, 'Please add a message with your request'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const AdoptionRequest = mongoose.model('AdoptionRequest', adoptionRequestSchema);

export default AdoptionRequest;
