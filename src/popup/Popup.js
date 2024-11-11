/* global chrome */

import React, { useState } from "react";
import "./Popup.css";

function Popup() {
  const [nonFollowers, setNonFollowers] = useState([]);
  const [ids, setIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNonFollowers = () => {
    setLoading(true);
    chrome.runtime.sendMessage({ action: "startCollecting" }, (response) => {
      if (response.nonFollowers && response.ids) {
        setNonFollowers(response.nonFollowers);
        setIds(response.ids);
      } else if (response.error) {
        console.error(response.error);
      }
    });
  };

  return (
    <div className="popup-container">
      <h2>언팔 확인하기</h2>
      <button
        className="refresh-button"
        onClick={fetchNonFollowers}
        disabled={loading}
      >
        {loading ? "로딩 중..." : "갱신"}
      </button>

      <div className="non-followers-list">
        {nonFollowers.length > 0 ? (
          nonFollowers.map((user, index) => (
            <div key={index} className="non-follower-item">
              <span>{user}</span>
              <a
                href={`https://twitter.com/${ids[index]}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                프로필 보기
              </a>
            </div>
          ))
        ) : loading ? (
          <p>로딩 중입니다.</p>
        ) : (
          <p>비팔로우 사용자가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Popup;
