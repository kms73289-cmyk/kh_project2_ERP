import React from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import Comment from "./Comment";
import "./cmnt.css";
import { EditDeleteButton } from "../dependence/Cpnt";

function PostDetail() {
    const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
    const empid = empl?.employee_id;
    const location = useLocation();
    const post = location.state?.post;

    if (!post) {
        return <div>게시글을 불러오는 중...</div>
    }
    return (
        <div>
            <h1> 게시판 </h1>
            <div className="post-head">
                <h3>{post.post_title}</h3>
                <p>{post.author} | {post.created_at.slice(0, 19).replace("T", " ")}</p>
            </div>
            <div className="post-main">
                <p>{post.post_content}</p>
            </div>
            <Comment empid={empid} />
            <div className="post-foot">
                <Link to="../community/postList">돌아가기</Link>
            </div>
        </div>
    )
}

export default PostDetail;