import axios from "axios";
import React, { useEffect, useState } from "react";

import { ShowBoxNumber } from "../dependence/Cpnt";
import { useNavigate } from "react-router-dom";

function PostList() {
    const navi = useNavigate()
    //데이터 조회
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:3000/posts')
            .then(res => setPosts(res.data))
            .catch(err => console.log(err));;
    }, []);

    //게시판
    const [selectedBoard, setSelectedBoard] = useState("전체");
    const [selectedType, setSelectedType] = useState("전체");

    const filteredPosts = posts.filter(
        post => (selectedBoard === "전체" || post.board_type === selectedBoard) &&
            (selectedBoard !== "일반 게시글" || selectedType === "전체" || post.post_type === selectedType)
    );

    const checkAdmin = (post) => {
        const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
        const is_admin = empl?.is_admin == 1;
        if (post.is_secret && (!is_admin && post.employee_id != empl?.employee_id)) {
            alert("비밀글은 작성자 또는 관리자만 열람할 수 있습니다.");
            return;
        }
        navi(`../community/postDetail/${post.post_id}`, { state: { post } });
    }

    return (
        <div>
            <h1>
                {selectedBoard === "전체" ? "전체 커뮤니티" : selectedType !== "전체" ? selectedType : selectedBoard}
            </h1>
            <div className="box-container">
                {
                    ["전체", "공지사항", "일반 게시글"].map((txt) => {
                        if (txt === "전체")
                            return <ShowBoxNumber key={txt} txt={txt} length={posts.length} />
                        return <ShowBoxNumber key={txt} txt={txt} length={posts.filter(p => p.board_type === txt).length} />
                    })
                }
            </div>
            <div className="container-top">
                <div className="top-button">
                    <button className={selectedBoard === "전체" ? "selected" : "unselected"} type="button" onClick={() => { setSelectedBoard("전체"); setSelectedType("전체"); }}>전체</button>
                    <button className={selectedBoard === "공지사항" ? "selected" : "unselected"} type="button" onClick={() => { setSelectedBoard("공지사항"); setSelectedType("전체"); }}>공지사항</button>
                    <button className={selectedBoard === "일반 게시글" && selectedType === "전체" ? "selected" : "unselected"} type="button" onClick={() => { setSelectedBoard("일반 게시글"); setSelectedType("전체"); }}>일반 게시판</button>
                    <button className={selectedType === "자료공유" && selectedBoard === "일반 게시글" ? "selected" : "unselected"} type="button" onClick={() => { setSelectedBoard("일반 게시글"); setSelectedType("자료공유"); }}>자료공유</button>
                    <button className={selectedType === "질문" && selectedBoard === "일반 게시글" ? "selected" : "unselected"} type="button" onClick={() => { setSelectedBoard("일반 게시글"); setSelectedType("질문"); }}>질문</button>
                    <button className={selectedType === "건의사항" && selectedBoard === "일반 게시글" ? "selected" : "unselected"} type="button" onClick={() => { setSelectedBoard("일반 게시글"); setSelectedType("건의사항"); }}>건의사항</button>
                </div>
            </div>
            <div className="container">
                <table border="1">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>유형</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map((post, index) => (
                            <tr key={post.post_id}>
                                <td>{filteredPosts.length - index}</td>
                                <td>{post.board_type === "공지사항" ? "공지사항" : post.post_type}</td>
                                <td className="onClickTable" onClick={() => checkAdmin(post)}>
                                    <strong>{post.post_title}{post.is_secret ? "🔒 " : ""}</strong>
                                </td>
                                <td>{post.author}</td>
                                <td>{post.created_at.slice(0, 10)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PostList;