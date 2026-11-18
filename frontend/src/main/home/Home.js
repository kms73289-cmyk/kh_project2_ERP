import { useState } from "react";
import AdminHome from "./AdminHome";
import MyHome from "./MyHome";

import "./home.css";

function Home({ isAdmin, ...myHomeProps }) {

  const [showAdmin, setShowAdmin] = useState(false);
  const toggle = isAdmin ? (
    <button className="home-mode-button" type="button" onClick={() => setShowAdmin(prev => !prev)}>
      {showAdmin ? "내 업무 보기" : "운영 현황 보기"}
    </button>
  ) : null;
  return isAdmin && showAdmin
    ? <AdminHome {...myHomeProps} homeAction={toggle} />
    : <MyHome {...myHomeProps} homeAction={toggle} />;
}

export default Home;
