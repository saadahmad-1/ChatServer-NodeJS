import responses from "../constants/responses";
const { User } = require("../models/User");

class UserService {
  createUser = async (payload, file) => {
    const {
      firstName,
      lastName,
      phoneNumber,
    } = payload;

    let existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return responses[102]("Phone Number is already registered");
    }
    const parseJSON = (data) => {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    };

    let newUser = await User.create({
      firstName,
      lastName,
      phoneNumber,
    });
    return responses[0]("User Created Successfully");
  };
}

export default UserService;
