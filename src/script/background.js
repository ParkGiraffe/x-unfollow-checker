async function scrollAndCollect() {
  const nonFollowers = [];
  const allFollowers = [];

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
          const userId = follower.querySelector(
            ".css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-b88u0q.r-1awozwy.r-6koalj.r-1udh08x.r-3s2u2q"
          ).textContent;
          nonFollowers.push(userId);
        }
      });

      setTimeout(() => {
        if (document.body.scrollHeight > lastHeight) {
          resolve();
        } else {
          resolve("done");
        }
      }, 4000);
    });
  };

  // 모든 팔로잉 목록이 로드될 때까지 스크롤
  while ((await scrollToBottom()) !== "done") {}
  console.log(nonFollowers);
  return nonFollowers;
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
            sendResponse({ nonFollowers: results[0].result });
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

// async function scrollAndCollect() {
//   const nonFollowers = [];
//   const allFollowers = [];

//   const scrollToBottom = () => {
//     return new Promise((resolve) => {
//       let lastHeight = document.body.scrollHeight;
//       window.scrollTo(0, lastHeight);

//       // 모든 팔로워 요소 선택
//       const followers = document.querySelectorAll("[data-testid='UserCell']");
//       followers.forEach((follower) => {
//         // '나를 팔로우합니다' 표시가 있는지 확인
//         allFollowers.push(follower);
//         const followStatus = follower.querySelector(
//           "[data-testid='userFollowIndicator']"
//         );
//         if (!followStatus) {
//           const userId = follower.querySelector(
//             ".css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-b88u0q.r-1awozwy.r-6koalj.r-1udh08x.r-3s2u2q"
//           ).textContent;
//           nonFollowers.push(userId);
//         }
//       });

//       setTimeout(() => {
//         if (document.body.scrollHeight > lastHeight) {
//           resolve();
//         } else {
//           resolve("done");
//         }
//       }, 4000);
//     });
//   };

//   // 모든 팔로잉 목록이 로드될 때까지 스크롤
//   while ((await scrollToBottom()) !== "done") {}

//   console.log("나를 팔로우하지 않는 사용자:", nonFollowers);
//   console.log(allFollowers);

//   return nonFollowers;
// }

// // background.js: 메시지를 받아 스크립트를 실행하고 결과 반환
// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//   if (request.action === "startCollecting") {
//     let [activeTab] = await chrome.tabs.query({
//       active: true,
//       currentWindow: true,
//     });

//     chrome.scripting.executeScript(
//       {
//         target: { tabId: activeTab.id },
//         function: scrollAndCollect,
//       },
//       (results) => {
//         if (chrome.runtime.lastError) {
//           console.error(chrome.runtime.lastError);
//           sendResponse({ error: chrome.runtime.lastError.message });
//         } else if (results && results[0] && results[0].result) {
//           console.log("나를 팔로우하지 않는 사용자 목록:", results[0].result);
//           sendResponse({ nonFollowers: results[0].result });
//         }
//       }
//     );

//     return true; // 비동기 응답을 위해 true 반환
//   }
// });

// async function scrollAndCollect() {
//   const nonFollowers = [];
//   const allFollowers = [];
//   const scrollToBottom = () => {
//     return new Promise((resolve) => {
//       let lastHeight = document.body.scrollHeight;
//       window.scrollTo(0, lastHeight);

//       // 모든 팔로워 요소 선택
//       const followers = document.querySelectorAll("[data-testid='UserCell']");
//       console.log(followers);
//       followers.forEach((follower) => {
//         // '나를 팔로우합니다' 표시가 있는지 확인
//         allFollowers.push(follower);
//         const followStatus = follower.querySelector(
//           "[data-testid='userFollowIndicator']"
//         );
//         if (!followStatus) {
//           const userId = follower.querySelector(
//             ".css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-b88u0q.r-1awozwy.r-6koalj.r-1udh08x.r-3s2u2q"
//           ).textContent;
//           nonFollowers.push(userId);
//         }
//       });

//       setTimeout(() => {
//         if (document.body.scrollHeight > lastHeight) {
//           resolve();
//         } else {
//           resolve("done");

//           console.log("나를 팔로우하지 않는 사용자:", nonFollowers);
//           console.log(allFollowers);
//         }
//       }, 4000);
//     });
//   };

//   // 모든 팔로잉 목록이 로드될 때까지 스크롤
//   while ((await scrollToBottom()) !== "done") {}
//   console.log(2);
//   return nonFollowers;
// }

// // background.js: 메시지를 받아 스크립트를 실행하고 결과 반환
// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//   if (request.action === "startCollecting") {
//     let [activeTab] = await chrome.tabs.query({
//       active: true,
//       currentWindow: true,
//     });
//     chrome.scripting
//       .executeScript({
//         target: { tabId: activeTab.id },
//         function: scrollAndCollect,
//       })
//       .then((results) => {
//         console.log(1);
//         console.log(results);
//         sendResponse({ nonFollowers: results[0].result });
//       });
//     return true; // 비동기 응답을 위해 true 반환
//   }
// });
