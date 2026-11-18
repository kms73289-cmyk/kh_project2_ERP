const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// SQL 종류별 라우터 연결 (기존 URL 유지)
app.use(require("./sql/select"));
app.use(require("./sql/insert"));
app.use(require("./sql/update"));
app.use(require("./sql/delete"));
app.use(require("./sql/login"));

// 이미지 경로
app.use('/images', express.static('upload_img'));

const upload = require("./uploadImg");
app.post("/uploadImg",
    upload.fields([
        { name: "mainImg", maxCount: 1 },
        { name: "detailImg", maxCount: 1 },
        { name: "img", maxCount: 1 }
    ]),
    (req, res) => {
        res.json({
            product_image: req.files.mainImage?.[0]
                ? "mainImg/" + req.files.mainImg[0].filename
                : null,
            product_description_image: req.files.detailImage?.[0]
                ? "detailImg/" + req.files.detailImg[0].filename
                : null
        });
    }
);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`연결중인 PORT : ${PORT}`);
});
