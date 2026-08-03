import Wishlist from '../models/Wishlist.js';
import Pet from '../models/Pet.js';

// @desc    Add a pet to user's wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const { petId } = req.body;
    const userId = req.user._id;

    if (!petId) {
      return res.status(400).json({ message: 'Pet ID is required' });
    }

    const petExists = await Pet.findById(petId);
    if (!petExists) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Check if already in wishlist
    const alreadyWishlisted = await Wishlist.findOne({ userId, petId });
    if (alreadyWishlisted) {
      return res.status(400).json({ message: 'Pet is already in your wishlist' });
    }

    const wishlistItem = await Wishlist.create({ userId, petId });
    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove a pet from user's wishlist
// @route   DELETE /api/wishlist/:petId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const { petId } = req.params;
    const userId = req.user._id;

    const wishlistItem = await Wishlist.findOneAndDelete({ userId, petId });
    if (!wishlistItem) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.status(200).json({ message: 'Removed from wishlist successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's wishlist items
// @route   GET /api/wishlist
// @access  Private
export const getMyWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    // Find wishlist items and populate the pet details
    const wishlistItems = await Wishlist.find({ userId })
      .populate('petId')
      .sort({ createdAt: -1 });

    // Filter out items where the pet might have been deleted from the database
    const pets = wishlistItems
      .filter((item) => item.petId !== null)
      .map((item) => item.petId);

    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
