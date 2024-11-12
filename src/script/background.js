async function scrollAndCollect() {
  const nonFollowers = [];
  const allFollowers = [];
  const ids = [];

  const scrollToBottom = () => {
    return new Promise((resolve) => {
      let lastHeight = document.body.scrollHeight;
      window.scrollTo(0, lastHeight);

      // 모든 팔로워 요소 선택
      const followers = document.querySelectorAll("[data-testid='UserCell']");
      followers.forEach((follower) => {
        // '나를 팔로우합니다' 표시가 있는지 확인
        allFollowers.push(follower);
        const followStatus = follower.querySelector(
          "[data-testid='userFollowIndicator']"
        );
        if (!followStatus) {
          const userNick = follower.querySelector(
            ".css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-b88u0q.r-1awozwy.r-6koalj.r-1udh08x.r-3s2u2q"
          ).textContent;
          const userId = follower
            .querySelector("[href]")
            .getAttribute("href")
            .replace("/", "");
          // 중복 확인: ids 배열에 userId가 없는 경우만 추가
          if (!ids.includes(userId)) {
            nonFollowers.push(userNick);
            ids.push(userId);
          }
        }
      });

      setTimeout(() => {
        if (document.body.scrollHeight > lastHeight) {
          resolve();
        } else {
          resolve("done");
        }
      }, 3000);
    });
  };

  // 모든 팔로잉 목록이 로드될 때까지 스크롤
  while ((await scrollToBottom()) !== "done") {}
  console.log(nonFollowers);
  return { nonFollowers, ids };
}

// background.js: 메시지를 받아 스크립트를 실행하고 결과 반환
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startCollecting") {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      async ([activeTab]) => {
        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: scrollAndCollect,
          });

          // 결과가 성공적으로 반환될 경우 sendResponse로 전달
          if (results && results[0] && results[0].result) {
            sendResponse({
              nonFollowers: results[0].result.nonFollowers,
              ids: results[0].result.ids,
            });
          } else {
            sendResponse({ error: "스크립트 실행 결과가 없습니다." });
          }
        } catch (error) {
          console.error(error);
          sendResponse({ error: error.message });
        }
      }
    );

    // 비동기 응답을 위해 true 반환
    return true;
  }
});
