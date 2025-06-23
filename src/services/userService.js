import responses from "../constants/responses.js";
import User from "../models/User.js";
class UserService {
  createUser = async (payload) => {
    const {
      firstName,
      lastName,
      phoneNumber,
    } = payload;
    
    let existingUser = await User.findOne({ where: { phoneNumber } });
    if (existingUser) {
      return responses[102]("Phone Number is already registered");
    }
    
    let newUser = await User.create({
      firstName,
      lastName,
      phoneNumber,
    });
    return responses[0]("User Created Successfully", newUser);
  };
}

export default UserService;