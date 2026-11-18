import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { EditDeleteButton } from '../dependence/Cpnt';

function MyPosts() {
    const navi = useNavigate();
    const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
    const empid = empl?.employee_id;
    const [posts, setPosts] = useState([]);

    const [selectedBoard, setSelectedBoard] = useState("전체");
    const [selectedType, setSelectedType] = useState("전체");

    const filteredPosts = posts.filter(
        post =>
            (selectedBoard === "전체" || post.board_type === selectedBoard) &&
            (selectedBoard !== "일반 게시글" || selectedType === "전체" || post.post_type === selectedType)
    );

    useEffect(() => {
        axios.get(`http://localhost:3000/employees/${empid}/posts`)
            .then((res) => {
                setPosts(res.data);
            })
            .catch((err) => {
                console.error("게시글 조회 실패:", err);
            });
    }, [])

    return (
        <div>
            <div>
                <h1>내 게시글</h1>
            </div>
            <div className="container-top">
                <div className='top-button'>
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
                            <th>제목</th>
                            <th>게시판</th>
                            <th>작성일</th>
                            <th>비고</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map((post, index) => (
                            <tr key={post.post_id}>
                                <td>{posts.length - index}</td>
                                <td className="onClickTable" onClick={() =>
                                    navi("../community/postDetail/" + post.post_id, { state: { post } })}>
                                    {post.post_title}
                                </td>
                                <td>
                                    <span>
                                        {post.board_type === "공지사항" ? "공지사항" : post.post_type}
                                    </span>
                                </td>

                                <td>{post.created_at.slice(0, 10)}</td>
                                <td style={{ width: "20%" }}>
                                    <EditDeleteButton txt={"게시글"} item={post} id={post?.post_id} address={"posts"} editPage={"community/edit"} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MyPosts;