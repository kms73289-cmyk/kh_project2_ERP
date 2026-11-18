import React, { useEffect, useState } from "react";

import { EditDeleteButton, ShowBoxNumber } from "../dependence/Cpnt";
import { ecm_category_arr } from "../dependence/Arr";
import "./ecm.css";

function Product({ products }) {
    const [select, setSelect] = useState(ecm_category_arr[0]);//버튼
    const [detail, setDetail] = useState(null);
    useEffect(() => {
        if (products.length > 0 && detail === null)
            setDetail(products[0]);
    }, [products, detail]);
    return (
        <div>
            <h1>상품 목록</h1>
            <div className="box-container">
                {
                    ecm_category_arr.map(txt => {
                        if (txt === "전체")
                            return <ShowBoxNumber key={txt} txt={txt + " 상품"} length={products.length} />
                        else {
                            const length = products.filter(p => p.category === txt).length
                            return <ShowBoxNumber key={txt} txt={txt + " 상품"} length={length} />
                        }
                    })
                }
            </div>
            <div className="container-top">
                <div className="top-button">
                    <label>카테고리</label>
                    {
                        ecm_category_arr.map(txt => (
                            <button key={txt} className={select === txt ? "selected" : "unselected"} type="button" onClick={() => setSelect(txt)}>{txt}</button>
                        ))
                    }
                </div>
            </div>
            <div className="container">
                <div className="center">
                    <table border="1">
                        <thead>
                            <tr>
                                <th>상품명</th>
                                <th>카테고리</th>
                                <th>상품가격</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.filter(item => select === "전체" || item.category === select)
                                .map((item) => (
                                    <tr key={item.product_id}>
                                        <td className="onClickTable" onClick={() => setDetail(item)}>
                                            <strong>{item.product_name}</strong>
                                        </td>
                                        <td>{item.category}</td>
                                        <td>{item.product_price}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                {detail != null && <DetailProduct detail={detail} />}
            </div>
        </div>
    );
}

function DetailProduct({ detail }) {
    return (
        <div className="right">
            <div className="right-detailInfo">
                <h3>{detail?.product_name}</h3>
                <p><span>가격 :</span>{detail?.product_price}</p>
                <p><span>설명 :</span></p>
                <p>{detail?.product_description}</p>
                <p><span>상품 이미지</span></p>
                <div className="detail_mainimg">
                    <img src={`http://localhost:3000/images/${detail?.product_image}`} alt="상품이미지" />
                </div>
            </div>
            <EditDeleteButton txt={"상품"} item={detail} id={detail?.product_id} address={"products"} editPage={"ecommerce/productNew"} />
        </div>
    );
}

export default Product;