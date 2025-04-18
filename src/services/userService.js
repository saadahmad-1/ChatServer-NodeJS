import responses from "../constants/responses";
import User from "../models/User";
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
    return responses[0]("User Created Successfully");
  };
}

export default UserService;
