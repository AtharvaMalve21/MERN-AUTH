import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
   if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with the provided email.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: "User profile data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
