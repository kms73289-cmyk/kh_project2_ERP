const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folders = {
            mainImg: "mainImg",
            detailImg: "detailImg",
            img: "preview"
        };

        cb(null, path.join(__dirname, "upload_img", folders[file.fieldname]));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

module.exports = upload;