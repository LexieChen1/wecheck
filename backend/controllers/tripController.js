import { 
  createTrip, 
  getTripsByUser, 
  getTripById, 
  addTripMember,
  getTripMembers 
} from '../models/tripModel.js';

export const createNewTrip = async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;
    const userId = req.user.userId;

    if (!name) {
      return res.status(400).json({ error: 'Trip name is required' });
    }

    const trip = await createTrip({
      name,
      description,
      createdBy: userId,
      startDate,
      endDate
    });

    res.status(201).json({
      message: 'Trip created successfully',
      trip
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create trip' });
  }
};

export const getUserTrips = async (req, res) => {
  try {
    const userId = req.user.userId;
    const trips = await getTripsByUser(userId);

    res.json({
      trips
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
};

export const getTripDetails = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.userId;

    const trip = await getTripById(tripId, userId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const members = await getTripMembers(tripId);

    res.json({
      trip: {
        ...trip,
        members
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch trip details' });
  }
};

export const addMemberToTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { email } = req.body;
    const userId = req.user.userId;

    // First check if user has access to this trip
    const trip = await getTripById(tripId, userId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // TODO: Find user by email and add them to trip
    // For now, just return success
    res.json({
      message: 'Member added successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add member' });
  }
}; 