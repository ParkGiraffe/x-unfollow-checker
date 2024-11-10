// src/Popup.js
/* global chrome */

import React, { useState } from "react";
import "./Popup.css";

function Popup() {
  const [nonFollowers, setNonFollowers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 비팔로우 사용자 목록을 수집하는 함수
  const fetchNonFollowers = () => {
    setLoading(true);
    chrome.runtime.sendMessage({ action: "startCollecting" }, (response) => {
      setNonFollowers(response.nonFollowers || []);
      setLoading(false);
    });
  };

  return (
    <div className="popup-container">
      <h2>비팔로우 사용자 확인</h2>
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
                href={`https://twitter.com/${user}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                프로필 보기
              </a>
            </div>
          ))
        ) : (
          <p>비팔로우 사용자가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Popup;
