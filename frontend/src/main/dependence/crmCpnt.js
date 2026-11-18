import React, { useEffect, useState } from "react";
import axios from "axios";

export function SearchCustomer({ setState }) {
    const [search, setSearch] = useState(""); //검색할 이름 or 전화번호
    const [searchResults, setSearchResults] = useState([]); //검색 결과
    useEffect(() => {
        axios.get("http://localhost:3000/customerlist")
            .then(res => setSearchResults(res.data))
            .catch(err => console.log(err));
    }, []);
    return (
        <div>
            <div className="input-data">
                <input type="search" name="searchName" placeholder="고객 검색" value={search} onChange={(e) => setSearch(e.target.value)} autoComplete="off" />
            </div>
            <div>
                {
                    search.trim() !== "" && searchResults.filter(c => c.customer_name?.includes(search.trim()) || c.customer_phone?.includes(search.trim())).map(item => (
                            <li key={item.customer_id}>
                                {item.customer_id} : {item.customer_name}
                                <button type="button" onClick={() => setState(item)}>추가</button>
                            </li>
                        ))
                }
            </div>
        </div>
    );
}