import Pet from '../models/Pet.js';

// @desc    Create a new pet listing
// @route   POST /api/pets
// @access  Private
export const createPet = async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      gender,
      image,
      healthStatus,
      vaccinationStatus,
      location,
      adoptionFee,
      description,
    } = req.body;

    const ownerEmail = req.user.email; // Auto-filled from verified JWT

    const pet = await Pet.create({
      name,
      species,
      breed,
      age,
      gender,
      image,
      healthStatus,
      vaccinationStatus,
      location,
      adoptionFee: Number(adoptionFee),
      description,
      ownerEmail,
      status: 'available',
    });

    res.status(201).json(pet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all pets with search, filter, and sorting
// @route   GET /api/pets
// @access  Public
export const getPets = async (req, res) => {
  try {
    const { search, species, sort } = req.query;
    let query = {};

    // 1. Search by Name (using $regex)
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // 2. Filter by Species (using $in)
    if (species) {
      // Allow comma separated species, e.g. "Dog,Cat"
      const speciesList = species.split(',').map((s) => s.trim());
      query.species = { $in: speciesList.map((s) => new RegExp(`^${s}$`, 'i')) };
    }

    // Default to show all pets or optionally filter status
    // On the public All Pets page, we usually show available pets first or just all.
    // Let's support an optional status query parameter, defaulting to available pets
    const statusQuery = req.query.status;
    if (statusQuery) {
      query.status = statusQuery;
    }

    // 3. Sorting
    let sortBy = { createdAt: -1 }; // default: newest first
    if (sort) {
      if (sort === 'feeAsc') {
        sortBy = { adoptionFee: 1 };
      } else if (sort === 'feeDesc') {
        sortBy = { adoptionFee: -1 };
      } else if (sort === 'ageAsc') {
        sortBy = { age: 1 };
      } else if (sort === 'nameAsc') {
        sortBy = { name: 1 };
      }
    }

    const pets = await Pet.find(query).sort(sortBy);
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single pet by ID
// @route   GET /api/pets/:id
// @access  Public
export const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a pet listing
// @route   PUT /api/pets/:id
// @access  Private
export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Validate ownership
    if (pet.ownerEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to update this pet listing' });
    }

    const {
      name,
      species,
      breed,
      age,
      gender,
      image,
      healthStatus,
      vaccinationStatus,
      location,
      adoptionFee,
      description,
      status,
    } = req.body;

    pet.name = name || pet.name;
    pet.species = species || pet.species;
    pet.breed = breed || pet.breed;
    pet.age = age || pet.age;
    pet.gender = gender || pet.gender;
    pet.image = image || pet.image;
    pet.healthStatus = healthStatus || pet.healthStatus;
    pet.vaccinationStatus = vaccinationStatus || pet.vaccinationStatus;
    pet.location = location || pet.location;
    pet.adoptionFee = adoptionFee !== undefined ? Number(adoptionFee) : pet.adoptionFee;
    pet.description = description || pet.description;
    pet.status = status || pet.status;

    const updatedPet = await pet.save();
    res.status(200).json(updatedPet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a pet listing
// @route   DELETE /api/pets/:id
// @access  Private
export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Validate ownership
    if (pet.ownerEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to delete this pet listing' });
    }

    await pet.deleteOne();
    res.status(200).json({ message: 'Pet listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get listings by current logged-in user + statistics
// @route   GET /api/pets/my-listings
// @access  Private
export const getMyListings = async (req, res) => {
  try {
    const ownerEmail = req.user.email;
    const listings = await Pet.find({ ownerEmail }).sort({ createdAt: -1 });

    const totalListings = listings.length;
    const availableListings = listings.filter((p) => p.status === 'available').length;
    const adoptedListings = listings.filter((p) => p.status === 'adopted').length;

    res.status(200).json({
      listings,
      stats: {
        total: totalListings,
        available: availableListings,
        adopted: adoptedListings,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
