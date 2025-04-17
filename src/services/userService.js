import responses from "../constants/responses";
const { User, Transaction } = require("../models");

class UserService {
  createUser = async (payload, file) => {
    const {
      firstName,
      lastName,
      phone,
    } = payload;

    let existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return responses[102]("Phone is already registered");
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
      phone,
    });
    return responses[0]("User Created Successfully");
  };
}

export default UserService;
