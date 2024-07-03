import User from '../models/userModel.js';

export const ValidateApiKey = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('key',user.apiKey);
    const apiKey = req.headers['x-api-key'];
    console.log('Head',apiKey);
    if (!apiKey || apiKey !== user.apiKey) {
      return res.status(401).json({ message: 'Invalid API Key' });
    }
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


