import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import Estore from "./preview/Estore";
import EstoreDetail from "./preview/EstoreDetail";
import { handleSubmitImg } from "../dependence/Func";
import "./ecm.css";
import "./layout.css";

function Layout() {
    const navi = useNavigate();
    const category = ["header", "banner", "category", "product", "review", "inquiry", "footer"];
    const [storeData, setStoreData] = useState([]); //데이터
    const [img, setImg] = useState(null); //이미지
    const [select, setSelect] = useState(category[0]);

    useEffect(() => {
        fetch("http://localhost:3000/store")
            .then(res => res.json())
            .then(data => setStoreData(data))
            .catch(err => console.log(err));
    }, []);
    useEffect(() => {
        setImg(storeData.find(s =>
            s.l_category === select && s.l_sub === "img")?.image_path ?? null);
    }, [select, storeData]);

    const handleChange = (id, value) => {
        setStoreData(prev =>
            prev.map(s => s.layout_id === id ? { ...s, content_text: value } : s));
    };
    const handleShow = (id, checked) => {
        setStoreData(prev => prev.map(s => s.layout_id === id ? { ...s, show_item: checked } : s));
    };
    return (
        <div>
            <h1>홈페이지 레이아웃 관리</h1>
            <div className="container-top">
                <div className="select-date">
                    <label>카테고리</label>
                    <select value={select} onChange={(e) => setSelect(e.target.value)}>
                        {category.map(txt => <option key={txt} value={txt}>{txt}</option>)}
                    </select>
                </div>
            </div>
            <div className="container">
                <div className="left-edit">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData();
                        let data = storeData;
                        if (img instanceof File) {
                            formData.append("img", img);
                            data = storeData.map(s =>
                                s.l_category === select && s.l_sub === "img" ?
                                    { ...s, image_path: "preview/" + img.name } : s);
                        }
                        handleSubmitImg({
                            data: { storeData: data },
                            formData: formData,
                            saveAdress: "",
                            updateAdress: "updateStore",
                            mainPage: "ecommerce/ecommerce",
                            bool: false,
                            txt: "홈페이지",
                            navi
                        });
                    }}>
                        {//업데이트 / 숨기기
                            storeData.filter(s => s.l_category === select).map(sub => {
                                if (sub.l_sub === "img")
                                    return (
                                        <div key={sub.layout_id}>
                                            <label>이미지</label>
                                            <input type="file" accept="image/*" onChange={(e) => setImg(e.target.files[0])} />
                                            <div className="inputform">
                                                <img src={img instanceof File ? URL.createObjectURL(img) : `http://localhost:3000/images/${img}`}
                                                    alt="이미지" />
                                            </div>
                                        </div>);
                                if (["title", "point", "sub"].includes(sub.l_sub))
                                    return (
                                        <div key={sub.layout_id}>
                                            <label>{sub.l_sub}</label>
                                            <input type="text" value={sub.content_text ?? ""}
                                                onChange={e => handleChange(sub.layout_id, e.target.value)}
                                            />
                                        </div>);
                                if (sub.l_sub === "arr")
                                    return (
                                        <div key={sub.layout_id}>
                                            <label>항목</label>
                                            <label>
                                                <input type="checkbox" checked={Boolean(sub.show_item)} onChange={e => handleShow(sub.layout_id, e.target.checked)} />
                                                표시
                                            </label>
                                            <input type="text" value={sub.content_text ?? ""} onChange={e => handleChange(sub.layout_id, e.target.value)} />
                                        </div>);
                            })
                        }
                        <button>저장</button>
                    </form>
                </div>
                <div className="right-preview">
                    <Routes>
                        <Route path="/" element={<Estore storeData={storeData} />} />
                        <Route path="/store/:id" element={<EstoreDetail storeData={storeData} />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Layout;