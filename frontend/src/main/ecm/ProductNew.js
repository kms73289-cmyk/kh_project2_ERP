import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import { handleSubmitImg } from "../dependence/Func";
import "./ecm.css";
import { ecm_category_arr } from "../dependence/Arr";

function ProductNew({ bool }) {
    const location = useLocation();
    const detail = location.state?.item;
    const ecm_category = ecm_category_arr.filter(arr => arr != "전체");
    const [selcate, setSelCate] = useState(bool ? ecm_category[0] : detail.category);
    const [imgmain, setimgMain] = useState(null);
    const [imgdetail, setimgDetail] = useState(null);
    const [input, setInput] = useState(
        bool ?
            { pdname: "", description: "", price: "" } :
            { pdname: detail.product_name, description: detail.product_description, price: detail.product_price, pdid: detail.product_id }
    )
    const handleChange = (e) => setInput({ ...input, [e.target.name]: e.target.value });
    return (
        <div className="input">
            {bool ? <h1>상품 등록</h1> : <h1>상품 수정</h1>}
            <div className="input-container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = {
                        ...input,
                        cate: selcate,
                        product_image: imgmain ? "mainImg/" + imgmain.name : null,
                        product_description_image: imgdetail ? "detailImg/" + imgdetail.name : null
                    };
                    const formData = new FormData();
                    if (imgmain) formData.append("mainImg", imgmain);
                    if (imgdetail) formData.append("detailImg", imgdetail);
                    handleSubmitImg({
                        data: data,
                        formData: formData,
                        saveAdress: "saveProduct",
                        updateAdress: "updateProduct",
                        mainPage: "ecommerce/product",
                        bool: bool,
                        txt: "상품"
                    });
                }}>
                    <div className="inputform">
                        <label>상품명</label>
                        <div className="input-data"><input type="text" name="pdname" value={input.pdname} onChange={handleChange} autoComplete="off" required /></div>
                    </div>
                    <div className="inputform">
                        <label>상품 가격</label>
                        <div className="input-data"><input type="number" name="price" value={input.price} onChange={handleChange} min="0" step="10000" required /></div>
                    </div>
                    <div className="inputform">
                        <label>상품 카테고리</label>
                        <div className="input-data">
                            <select value={selcate} onChange={(e) => setSelCate(e.target.value)}>
                                {ecm_category.map((txt, idx) => (
                                    <option key={idx} value={txt}>{txt}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="inputform">
                        <label>상품 설명</label>
                        <div className="input-data">
                            <textarea name="description" value={input.description} onChange={handleChange} rows="10" cols="30" />
                        </div>
                    </div>
                    <div className="inputform">
                        <label>상품 이미지 등록</label>
                        <div className="input-data">
                            <input type="file" accept="image/*" onChange={(e) => setimgMain(e.target.files[0])} />
                        </div>
                        <div className="inputimg">
                            {imgmain && (<img src={URL.createObjectURL(imgmain)} alt="대표 이미지" />)}
                        </div>
                    </div>
                    <div className="inputform">
                        <label>상세 이미지 등록</label>
                        <div className="input-data">
                            <input type="file" accept="image/*" onChange={(e) => setimgDetail(e.target.files[0])} />
                        </div>
                        <div className="inputimg">
                            {imgdetail && (<img src={URL.createObjectURL(imgdetail)} alt="상세 이미지" />)}
                        </div>
                    </div>
                    <button className="input-submit">{bool ? "상품 등록" : "상품 수정"}</button>
                </form>
            </div>
        </div>
    );
}

export default ProductNew;