import userModel from '../models/user.model.js';

async function isAdmin(req, res, next) {
  try {
    let user = await userModel.findOne({ email: req.user.email });

  } catch (error) {}
}

export default isAdmin;
