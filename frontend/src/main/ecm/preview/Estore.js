import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Estore.css";
import { FootEcms, HeaderEcms } from "./HeadFoot";

function Estore({ storeData }) {
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/products")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.log(err));
        fetch("http://localhost:3000/reviews")
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="allout">
            <HeaderEcms storeData={storeData.filter(s => s.l_category === "header" && s.show_item == 1)} />
            <main className="main-ecms">
                <Banner banner={storeData.filter(s => s.l_category === "banner" && s.show_item == 1)} />
                <ItemButton item={storeData.filter(s => s.l_category === "category" && s.show_item == 1)} />
                <ItemCard list={products} item={storeData.filter(s => s.l_category === "product" && s.show_item == 1)} />
                <ItemCard list={reviews} item={storeData.filter(s => s.l_category === "review" && s.show_item == 1)} />
                <ItemButton item={storeData.filter(s => s.l_category === "inquiry")} />
            </main>
            <FootEcms storeData={storeData.filter(s => s.l_category === "footer")} />
        </div>
    );
}
function Banner({ banner }) {
    return (
        <section className="banner"
            style={{
                backgroundImage: `linear-gradient(to right,rgba(235, 250, 245, 0.95) 10%,rgba(235, 250, 245, 0.75) 60%, transparent 90%),
                url("http://localhost:3000/images/${banner.find(b => b.l_sub === "img")?.image_path}")`
            }}>
            <h3>{banner.find(b => b.l_sub === "title")?.content_text}</h3>
            <p><strong>{banner.find(b => b.l_sub === "point")?.content_text}</strong></p>
            <p>{banner.find(b => b.l_sub === "sub")?.content_text}</p>
        </section>
    );
}

function ItemButton({ item }) {
    const img = item?.find(i => i.l_sub === "img");
    const title = item?.find(i => i.l_sub === "title");
    const sub = item?.find(i => i.l_sub === "sub");
    return (
        <section className="container-ecms">
            {
                (img || title) && (
                    <div className="title-ecms"
                        style={{ backgroundImage: `url("http://localhost:3000/images/${img?.image_path}")` }}>
                        <h3>{title?.content_text}</h3>
                        <p>{sub?.content_text}</p>
                    </div>
                )
            }
            <div className="street-icon">
                {
                    item?.filter(i => i?.l_sub === "arr").map((i) => (
                        <div key={i?.layout_id}>
                            <img src={`http://localhost:3000/images/${i?.image_path}`} alt={i?.content_text} />
                            <p><button type="button">{i?.content_text}</button></p>
                        </div>
                    ))
                }
            </div>
        </section>
    );
}

function ItemCard({ list, item }) {
    const img = item?.find(i => i.l_sub === "img");
    const title = item?.find(i => i.l_sub === "title");
    const sub = item?.find(i => i.l_sub === "sub");
    return (
        <div className="container-ecms">
            <div className="title-ecms"
                style={{ backgroundImage: `url("http://localhost:3000/images/${img?.image_path}")` }}>
                <h3>{title?.content_text}</h3>
                <p>{sub?.content_text}</p>
            </div>
            <div className="street-scroll">
                {list.map(li => (
                    item?.[0]?.l_category === "product" ?
                        <ProductList key={li.product_id} item={li} /> :
                        <ReviewList key={li.review_id} item={li} />
                ))}
            </div>
        </div>
    );
}

function ProductList({ item }) {
    const navi = useNavigate();
    return (
        <div className="list-ecms" onClick={() => navi("store/" + item?.product_id, { state: { item } })}>
            <img src={`http://localhost:3000/images/${item?.product_image}`} alt={item?.product_name} />
            <h4>{item?.product_name}</h4>
            <p><span>가격 : </span>{item?.product_price}</p>
        </div>
    );
}

function ReviewList({ item }) {
    return (
        <div className="list-ecms">
            {
                item.review_image !== null ?
                    (<img src={`http://localhost:3000/images/${item?.review_image}`} alt="리뷰 이미지" />) :
                    (<img src="http://localhost:3000/images/review/sample.png" alt="리뷰 이미지" />)
            }
            <p><span>{item?.customer_name?.slice(0, 3)} : </span>{item?.comment}</p>
            <p><span>별점 : </span>{item?.rating}</p>
        </div>
    );
}

export default Estore;

