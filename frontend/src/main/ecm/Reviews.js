import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ShowBoxNumber, ShowBoxPercent } from "../dependence/Cpnt";

function Reviews({ products }) {
    const [reviews, setReviews] = useState([]);
    const [select, setSelect] = useState("all");
    const [prod, setProd] = useState("");
    useEffect(() => {
        fetch("http://localhost:3000/reviews")
            .then(res => res.json())
            .then(data => {
                setReviews(data);
                setProd(products[0]?.product_id);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h1>리뷰 목록</h1>
            <div className="box-container">
                <ShowBoxNumber txt={"전체 리뷰"} length={reviews.length} />
                <ShowBoxPercent txt={"미응답 리뷰"} count={reviews.filter(rv => rv.admin_reply === null).length} total={reviews.length} />
                <ShowBoxPercent txt={"사진 첨부"} count={reviews.filter(rv => rv.review_image != null).length} total={reviews.length} />
                <ShowBoxPercent txt={"추천 리뷰"} count={reviews.filter(rv => rv.recommend === 1).length} total={reviews.length} />
                <ShowBoxPercent txt={"만점 리뷰"} count={reviews.filter(rv => rv.rating === 5).length} total={reviews.length} />
            </div>
            <div className="container-top">
                <div className="top-button">
                    <button className={select === "all" ? "selected" : "unselected"} type="button" onClick={() => setSelect("all")}>전체</button>
                    <button className={select === "" ? "selected" : "unselected"} type="button" onClick={() => setSelect("")}>미응답</button>
                </div>
                <div className="top-searchinput">
                    <label>상품 선택</label>
                    <select onChange={(e) => setProd(e.target.value)}>
                        {products.map(p => (
                            <option key={p.product_id} value={p.product_id}>{p.product_name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="container">
                <div className="center">
                    <table border="1">
                        <thead>
                            <tr>
                                <th>고객명</th>
                                <th>내용</th>
                                <th>평점</th>
                                <th>추천여부</th>
                                <th>응답여부</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.filter(item => select === "all" || item.admin_reply === null)
                                .map((item) => (
                                    <TableReview key={item.review_id} item={item} />
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className="right">
                    {prod && <DetailReview reviews={reviews.filter(rv => rv.product_id == prod)} />}
                </div>
            </div>
        </div>
    );
}

function DetailReview({ reviews }) {
    const cnt = reviews.length;
    const avg = cnt > 0 ? Math.round(reviews.reduce((sum, rv) => sum + rv.rating, 0) / cnt) : 0;
    return (
        <div className="right-detailInfo">
            <h3>{reviews[0]?.product_name}</h3>
            <p><span>평점</span>{avg}</p>
            <p><span>리뷰 수</span>{cnt}</p>
            {reviews.map(rv => (
                <div className="review-comment" key={rv.review_id}>
                    <p><span>{rv.created_at?.slice(0, 10)}<br />리뷰</span>{rv.comment}</p>
                    {rv.admin_reply !== null ?
                        <p><span>{rv.replied_at?.slice(0, 10)}<br />답변</span>{rv.admin_reply}</p> :
                        <p><span>답변 : </span>미응답</p>
                    }
                </div>
            ))}
        </div>
    );
}

function TableReview({ item }) {
    const navi = useNavigate();
    return (
        <tr>
            <td>{item.customer_name}</td>
            <td>{item.comment}</td>
            <td>{item.rating}</td>
            <td>{item.recommend ? "추천" : "비추천"}</td>
            <td>
                {item.admin_reply === null ?
                    <button className="edit-button" type="button" onClick={(e) => {
                        navi("../ecommerce/reviewsEdit", { state: { item } });
                    }}>답변 달기</button> :
                    "응답 완료"
                }
            </td>
        </tr>
    );
}

export default Reviews;