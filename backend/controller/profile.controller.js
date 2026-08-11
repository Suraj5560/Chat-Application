import userModel from '../model/user.model.js';
import cloudinary from '../lib/cloudinary.js';


const updateProfile = async (req, res) => {
    try {
        const { profilePic, fullName, bio } = req.body;  // fixed: was profileName (wrong key), added fullName

        const userId = req.user._id;
        let updatedUser;

        if (!profilePic) {
            updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { fullName, bio },  // fixed: was profileName, now uses fullName
                { new: true }
            );
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { profilePic: upload.secure_url, bio, fullName },
                { new: true }
            );
        }

        res.json({
            success: true,
            user: updatedUser
        });

    } catch (err) {
        console.log(err.message);
        res.json({
            success: false,
            message: err.message
        });
    }
};

export { updateProfile };