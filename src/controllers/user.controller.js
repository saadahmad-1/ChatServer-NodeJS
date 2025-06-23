import UserService from "../services/userService.js";

const userService = new UserService();


export const createUser = async (req, res, next) => {
  try {
    let resp = await userService.createUser(req.body);

    return res.status(200).json(resp);
  } catch (err) {
    console.log("Error:", err);
    next(err);
  }
};
