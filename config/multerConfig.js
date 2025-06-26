import multer from "multer";

const uploads = multer({ dest: "uploads/" });

export default uploads;
