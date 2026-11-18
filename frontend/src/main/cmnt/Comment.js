import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Comment() {
    const { id } = useParams();
    const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
    const empid = empl?.employee_id;
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [editId, setEditId] = useState(null);

    //해당 게시글의 댓글목록 조회
    useEffect(() => {
        axios.get(`http://localhost:3000/posts/${id}/comments`)
            .then((res) => {
                setComments(res.data);
            });
    }, [id])

    //댓글 등록
    const addComment = () => {

        //서버에 댓글내용 전송하여 데이터베이스 등록
        axios.post(`http://localhost:3000/posts/${id}/comments`, {
            employee_id: empid,
            content: content
        })
            .then(() => {
                setContent("");

                //댓글 목록 다시 조회
                axios.get(`http://localhost:3000/posts/${id}/comments`)
                    .then((res) => {
                        setComments(res.data)
                    });
            });
    };
    //댓글 삭제
    const deleteComment = (commentId) => {

        axios.delete(`http://localhost:3000/comments/${commentId}`, { data: { empid: empid } })
            .then(() => {
                //삭제 후 댓글 목록 다시 조회
                axios.get(`http://localhost:3000/posts/${id}/comments`, { data: { empid: empid } })
                    .then((res) => {
                        setComments(res.data);
                    });
            });
    };

    //댓글 수정
    const updateComment = (commentId) => {
        axios.put(`http://localhost:3000/comments/${commentId}`, { content: content, empid: empid })
            .then(() => {
                setContent("");
                setEditId(null);

                //수정 후 댓글 목록 다시 조회
                axios.get(`http://localhost:3000/posts/${id}/comments`)
                    .then((res) => {
                        setComments(res.data);
                    });
            });
    };

    // 댓글 등록 및 수정 처리, 입력값 유효성 검사
    const handleSubmit = (e) => {
        e.preventDefault();

        if (content.trim() === "") {
            alert("댓글을 입력하세요.")
            return;
        }

        if (editId !== null) {
            updateComment(editId);
        } else {
            addComment();
        }
    };

    return (
        <div className="post-comment">
            <h3>댓글</h3>
            <div className="comment-container">
                {comments.map((comment) => (
                    <div className="comment" key={comment.comment_id}>
                        <p>{comment.author}
                            <small>{comment.created_at.slice(0, 19).replace("T", " ")}</small>
                            <span>{comment.comment_content}</span>
                            {Number(comment.employee_id) === Number(empid) && (
                                <button
                                    className="cmnt-edit"
                                    type="button"
                                    onClick={() => {
                                        setEditId(comment.comment_id);
                                        setContent(comment.comment_content)
                                    }}> 수정
                                </button>
                            )}
                            {Number(comment.employee_id) === Number(empid) && (
                                <button className=" cmnt-delete" type="button" onClick={() => deleteComment(comment.comment_id)}>삭제</button>
                            )}
                        </p>
                    </div>
                ))}
            </div>
            <div className="cmnt-input">
                <form onSubmit={handleSubmit}>
                    <input placeholder="댓글을 입력하세요"
                        value={content}
                        onChange={(e) => setContent(e.target.value)} />
                    <button className="cmnt-submit">{editId !== null ? "수정완료" : "등록"}</button>
                </form>
            </div>
        </div>
    );
}

export default Comment;