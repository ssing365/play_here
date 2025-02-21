// 📂 frontend/src/utils/kakaoShare.js
export const initKakao = () => {
  if (!window.Kakao) {
      const script = document.createElement("script");
      script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
      script.integrity = "sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka";
      script.crossOrigin = "anonymous";
      script.onload = () => {
          if (window.Kakao) {
              window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
              console.log("✅ Kakao SDK 초기화 완료");
          }
      };
      document.head.appendChild(script);
  }
};

// 카카오 공유 버튼 클릭 시 실행
export const shareKakao = (coupleCode) => {
  if (!window.Kakao) {
      console.error("❌ Kakao SDK가 로드되지 않았습니다.");
      alert("카카오 공유를 사용할 수 없습니다.");
      return;
  }

  window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
          title: "여기놀자 커플 초대",
          description: "내 커플 코드로 연결해 보세요!",
          imageUrl: "https://your-image-url.com/image.png",
          link: {
              mobileWebUrl: `${window.location.origin}/connect-couple?code=${coupleCode}`,
              webUrl: `${window.location.origin}/connect-couple?code=${coupleCode}`,
          },
      },
      buttons: [
          {
              title: "커플 등록하기",
              link: {
                  mobileWebUrl: `${window.location.origin}/connect-couple?code=${coupleCode}`,
                  webUrl: `${window.location.origin}/connect-couple?code=${coupleCode}`,
              },
          },
      ],
  });
};
