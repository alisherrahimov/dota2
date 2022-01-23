export const errorHandler = (err, res,) => {
    res.status(500).json({ message: err, success: false });
}
