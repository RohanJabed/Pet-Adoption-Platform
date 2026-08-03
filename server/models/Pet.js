import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a pet name'],
      trim: true,
    },
    species: {
      type: String,
      required: [true, 'Please specify the species (e.g., Dog, Cat, Bird, Rabbit)'],
      trim: true,
    },
    breed: {
      type: String,
      required: [true, 'Please specify the breed'],
      trim: true,
    },
    age: {
      type: String,
      required: [true, 'Please specify the age (e.g., Puppy, 2 years)'],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, 'Please specify the gender'],
      enum: ['Male', 'Female', 'Unknown'],
      default: 'Unknown',
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    healthStatus: {
      type: String,
      required: [true, 'Please specify the health status'],
      trim: true,
    },
    vaccinationStatus: {
      type: String,
      required: [true, 'Please specify the vaccination status'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      trim: true,
    },
    adoptionFee: {
      type: Number,
      required: [true, 'Please add an adoption fee'],
      min: [0, 'Adoption fee cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    ownerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['available', 'adopted'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

// Enable text search on name, species, breed, and location
petSchema.index({ name: 'text', species: 'text', breed: 'text', location: 'text' });

const Pet = mongoose.model('Pet', petSchema);

export default Pet;
