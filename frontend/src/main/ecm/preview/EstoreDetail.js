import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FootEcms, HeaderEcms } from "./HeadFoot";

function EstoreDetail({ storeData }) {
    const { id } = useParams();
    const location = useLocation();
    const product = location.state?.item;

    if (storeData.length === 0) return <p>로딩 중...</p>;
    return (
        <div className="allout">
            <HeaderEcms storeData={storeData.filter(s=>s.l_category === "header")} />
            <main className="main-ecms">
                <div className="product-detail">

                    <div className="product-detail-top">
                        <div className="product-detail-image">
                            <img src={`http://localhost:3000/images/${product.product_image}`}
                                alt={product.product_name} />
                        </div>

                        <div className="product-detail-info">
                            <p className="product-category">{product.category}</p>
                            <h2>{product.product_name}</h2>
                            <p>{product.product_description}</p>

                            <div className="product-detail-price">
                                <span>상품 가격</span>
                                <strong>{Number(product.product_price).toLocaleString()}원</strong>
                            </div>
                            <div className="product-detail-buttons">
                                <button type="button">장바구니</button>
                                <button type="button">구매하기</button>
                            </div>
                        </div>
                    </div>

                    <div className="product-detail-bottom">
                        <h3>상품 상세정보</h3>
                        <img src={`http://localhost:3000/images/${product.product_description_image}`}
                            alt={`${product.product_name} 상세정보`} />
                    </div>

                </div>
            </main>
            <FootEcms storeData={storeData.filter(s=>s.l_category === "footer")} />
        </div>
    );
}
export default EstoreDetail;