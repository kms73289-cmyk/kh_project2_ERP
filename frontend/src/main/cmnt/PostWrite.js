import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { handleSubmit } from "../dependence/Func";

function PostWrite({ bool }) {
    const empl = JSON.parse(sessionStorage.getItem("empl") || "null");
    const empid = empl?.employee_id;
    const navi = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const post = location.state?.item;

    //게시글 작성
    const [title, setTitle] = useState("");
    const [boardType, setBoardType] = useState("일반 게시글");
    const [postType, setPostType] = useState("일반");
    const [isSecret, setIsSecret] = useState(false);
    const [content, setContent] = useState("");

    //게시글 수정 함수
    useEffect(() => {
        if (bool)
            return;
        setTitle(post?.post_title);
        setBoardType(post?.board_type);
        setPostType(post?.post_type);
        setIsSecret(post?.is_secret == 1);
        setContent(post?.post_content);
    }, [id, bool])
    const submit = (e)=>{
        e.preventDefault();
                    const data = {
                        title,
                        boardType,
                        postType: boardType === "공지사항" ? "일반" : postType,
                        isSecret,
                        content,
                        empid,
                        id:post?.post_id
                    };
                    handleSubmit({
                        data: data, bool: bool, saveAdress: "posts", updateAdress: "editposts",
                        mainPage: "community/postList", txt: "게시글"
                    });
    }
    return (
        <div className="input">
            <h1>{bool ? "게시글 수정" : "게시글 작성"}</h1>
            <div className="input-container">
                <form onSubmit={submit}>
                    <div className="inputform">
                        <label>카테고리</label>
                        <div className="input-data">

                            <select
                                value={boardType}
                                onChange={(e) => {
                                    setBoardType(e.target.value);

                                    if (e.target.value === "공지사항") {
                                        setPostType("일반");
                                    }
                                }}
                            >
                                <option value="공지사항">공지사항</option>
                                <option value="일반 게시글">일반 게시글</option>
                            </select>

                            {boardType === "일반 게시글" && (
                                <select value={postType} onChange={(e) => setPostType(e.target.value)}>
                                    <option value="일반">일반</option>
                                    <option value="질문">질문</option>
                                    <option value="자료공유">자료공유</option>
                                    <option value="건의사항">건의사항</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="inputform">
                        <label >제목</label>
                        <div className="input-data">
                            <input
                                required
                                type="text"
                                placeholder="제목을 입력하세요"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} />
                            비밀글

                        </div>
                    </div>
                    <div className="input-data">
                        <textarea name="message" rows="10" cols="30" required
                            value={content} onChange={(e) => setContent(e.target.value)} />
                    </div>
                    <button className="input-submit">
                        {bool ? "저장하기" : "수정하기"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PostWrite;