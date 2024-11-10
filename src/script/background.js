async function scrollAndCollect() {
  let nonFollowers = [];

  // 무한 스크롤 시작
  const scrollToBottom = () => {
    return new Promise((resolve) => {
      let lastHeight = document.body.scrollHeight;

      const scrollInterval = setInterval(() => {
        window.scrollBy(0, 1000); // 일정 간격만큼 스크롤

        if (document.body.scrollHeight > lastHeight) {
          lastHeight = document.body.scrollHeight;
        } else {
          clearInterval(scrollInterval);
          resolve("done");
        }
      }, 1000);
    });
  };

  // 모든 팔로잉 목록이 로드될 때까지 스크롤
  while ((await scrollToBottom()) !== "done") {}

  // 모든 팔로워 요소 선택
  const followers = document.querySelectorAll("[data-testid='UserCell']");

  followers.forEach((follower) => {
    const followStatus = follower.querySelector(
      ".css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3"
    );
    if (!followStatus) {
      const userId = follower
        .querySelector("[href]")
        .getAttribute("href")
        .replace("/", "");
      nonFollowers.push(userId);
    }
  });

  console.log("나를 팔로우하지 않는 사용자:", nonFollowers);
  return nonFollowers;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startCollecting") {
    chrome.scripting
      .executeScript({
        target: { tabId: sender.tab.id },
        function: scrollAndCollect,
      })
      .then((results) => {
        sendResponse({ nonFollowers: results[0].result });
      });
    return true;
  }
});

// // background.js
// async function scrollAndCollect() {
//   let nonFollowers = [];

//   // 무한 스크롤 시작
//   const scrollToBottom = () => {
//     return new Promise((resolve) => {
//       let lastHeight = document.body.scrollHeight;
//       window.scrollTo(0, lastHeight);
//       setTimeout(() => {
//         if (document.body.scrollHeight > lastHeight) {
//           resolve();
//         } else {
//           resolve("done");
//         }
//       }, 1000);
//     });
//   };

//   // 모든 팔로잉 목록이 로드될 때까지 스크롤
//   while ((await scrollToBottom()) !== "done") {}

//   // 모든 팔로워 요소 선택
//   const followers = document.querySelectorAll("[data-testid='UserCell']");

//   followers.forEach((follower) => {
//     // '나를 팔로우합니다' 표시가 있는지 확인
//     const followStatus = follower.querySelector(
//       ".css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3"
//     );
//     if (!followStatus) {
//       const userId = follower
//         .querySelector("[href]")
//         .getAttribute("href")
//         .replace("/", "");
//       nonFollowers.push(userId);
//     }
//   });

//   console.log("나를 팔로우하지 않는 사용자:", nonFollowers);
//   return nonFollowers;
// }

// // 스크롤 및 사용자 수집 후, popup.js로 메시지 전송
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "startCollecting") {
//     chrome.scripting
//       .executeScript({
//         target: { tabId: sender.tab.id },
//         function: scrollAndCollect,
//       })
//       .then((results) => {
//         sendResponse({ nonFollowers: results[0].result });
//       });
//     return true; // 비동기 응답을 위해 true 반환
//   }
// });
