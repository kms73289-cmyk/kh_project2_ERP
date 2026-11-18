import { Link, useNavigate } from "react-router-dom"

export function HeaderEcms({ storeData }) {
    const navi = useNavigate();
    return (
        <header className="head-ecms">
            <div className="head-left">
                <button className="none-button" type="button" onClick={() => navi("../")}>
                    <img src={`http://localhost:3000/images/${storeData.find(s => s.l_sub === "img")?.image_path}`}
                        alt={storeData.find(s => s.l_sub === "img")?.content_text} />
                </button>
            </div>
            <div className="head-right">
                {
                    storeData.filter(s => s.l_sub === "arr" && s.show_item == 1).map((txt, idx) => (
                        <Link key={idx} to={`../`}>{txt?.content_text}</Link>
                    ))
                }
            </div>
        </header>
    )
}

export function FootEcms({ storeData }) {
    return (
        <footer className="foot-ecms">
            {
                storeData.filter(s => s.show_item == 1).map((txt, idx) => (
                    <p key={idx}>{txt.content_text}</p>
                ))
            }
        </footer>
    )
}