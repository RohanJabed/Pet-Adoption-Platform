import AdoptionRequest from '../models/AdoptionRequest.js';
import Pet from '../models/Pet.js';

// @desc    Submit an adoption request
// @route   POST /api/requests
// @access  Private
export const submitRequest = async (req, res) => {
  try {
    const { petId, pickupDate, message } = req.body;
    const requesterEmail = req.user.email;
    const requesterName = req.user.name;

    if (!petId || !pickupDate || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Validation: Owner cannot adopt their own pet
    if (pet.ownerEmail === requesterEmail) {
      return res.status(400).json({ message: 'You cannot submit an adoption request for your own pet listing' });
    }

    // Validation: Pet must be available
    if (pet.status === 'adopted') {
      return res.status(400).json({ message: 'This pet has already been adopted' });
    }

    // Validation: Prevent duplicate pending requests by the same user for this pet
    const existingRequest = await AdoptionRequest.findOne({
      petId,
      requesterEmail,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this pet' });
    }

    const newRequest = await AdoptionRequest.create({
      petId,
      petName: pet.name,
      ownerEmail: pet.ownerEmail,
      requesterName,
      requesterEmail,
      pickupDate,
      message,
      status: 'pending',
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get requests submitted by current user
// @route   GET /api/requests/my-requests
// @access  Private
export const getMyRequests = async (req, res) => {
  try {
    const requesterEmail = req.user.email;
    const requests = await AdoptionRequest.find({ requesterEmail }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel/delete an adoption request
// @route   DELETE /api/requests/:id
// @access  Private
export const cancelRequest = async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    // Validate requester owns this request
    if (request.requesterEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to cancel this request' });
    }

    // Do not allow cancel if already approved/rejected
    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Cannot cancel request once it has been ${request.status}` });
    }

    await request.deleteOne();
    res.status(200).json({ message: 'Adoption request cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all requests for an owner's listings or a specific pet
// @route   GET /api/requests/listings/:petId
// @access  Private
export const getPetRequests = async (req, res) => {
  try {
    const { petId } = req.params;
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Validate ownership
    if (pet.ownerEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to view requests for this pet' });
    }

    const requests = await AdoptionRequest.find({ petId }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or reject a request
// @route   PUT /api/requests/:id
// @access  Private
export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update. Must be approved or rejected' });
    }

    const request = await AdoptionRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    // Verify current user is owner of the pet
    if (request.ownerEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    // Check if the request is already processed
    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request is already ${request.status}` });
    }

    const pet = await Pet.findById(request.petId);
    if (!pet) {
      return res.status(404).json({ message: 'Associated pet not found' });
    }

    if (status === 'approved') {
      // Check if pet is already adopted
      if (pet.status === 'adopted') {
        return res.status(400).json({ message: 'Pet has already been adopted under another request' });
      }

      // Update current request to approved
      request.status = 'approved';
      await request.save();

      // Mark the pet as adopted
      pet.status = 'adopted';
      await pet.save();

      // Reject all OTHER pending requests for this same pet
      await AdoptionRequest.updateMany(
        { petId: request.petId, _id: { $ne: request._id }, status: 'pending' },
        { $set: { status: 'rejected' } }
      );
    } else {
      // Rejection
      request.status = 'rejected';
      await request.save();
    }

    res.status(200).json({ message: `Request successfully ${status}`, request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
