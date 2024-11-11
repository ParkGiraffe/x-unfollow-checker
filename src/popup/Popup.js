/* global chrome */

import React, { useState, useEffect } from "react";
import "./Popup.css";

function Popup() {
  const [nonFollowers, setNonFollowers] = useState([]);
  const [ids, setIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // 팝업이 열릴 때 Chrome Storage에서 저장된 목록을 불러오기
  useEffect(() => {
    chrome.storage.local.get(["nonFollowers", "ids"], (result) => {
      if (result.nonFollowers && result.ids) {
        setNonFollowers(result.nonFollowers);
        setIds(result.ids);
      }
    });
  }, []);

  const fetchNonFollowers = () => {
    setLoading(true);
    chrome.runtime.sendMessage({ action: "startCollecting" }, (response) => {
      if (response.nonFollowers && response.ids) {
        setNonFollowers(response.nonFollowers);
        setIds(response.ids);

        // 비팔로워 목록을 Chrome Storage에 저장
        chrome.storage.local.set({
          nonFollowers: response.nonFollowers,
          ids: response.ids,
        });
      } else if (response.error) {
        console.error(response.error);
      }
      setLoading(false);
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
          <p>언팔로워가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Popup;
