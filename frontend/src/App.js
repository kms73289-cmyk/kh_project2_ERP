import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './login/Login';
import Signup from './login/Siginup';
import Main from './main/Main';

function App() {//React의 메인 컴포넌트.
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/main/:empid/*" element={<Main />} />
                </Routes>
            </BrowserRouter>
            <footer>
            </footer>
        </div>
    );
}

export default App;