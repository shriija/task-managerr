// Upload avatar image to Cloudinary
export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        const { default: cloudinary } = await import("../../config/cloudinary.js")

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "task-manager/avatars",
                    transformation: [
                        { width: 256, height: 256, crop: "fill", gravity: "face" },
                        { quality: "auto", fetch_format: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )
            stream.end(req.file.buffer)
        })

        res.status(200).json({ url: result.secure_url })
    } catch (error) {
        res.status(500).json({ message: "Avatar upload failed", error: error.message })
    }
}
