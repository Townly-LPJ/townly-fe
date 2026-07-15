const KAKAO_MAP_SCRIPT_ID = "kakao-map-sdk";

export const loadKakaoMap = () => {
  return new Promise((resolve, reject) => {
    const appKey = import.meta.env.VITE_KAKAO_MAP_KEY;

    console.log("카카오 지도 키 존재 여부:", Boolean(appKey));

    if (!appKey) {
      reject(new Error("VITE_KAKAO_MAP_KEY가 설정되지 않았습니다."));
      return;
    }

    if (window.kakao?.maps) {
      window.kakao.maps.load(() => {
        resolve(window.kakao);
      });
      return;
    }

    const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");

    script.id = KAKAO_MAP_SCRIPT_ID;
    script.type = "text/javascript";
    script.src =
      `https://dapi.kakao.com/v2/maps/sdk.js` +
      `?appkey=${encodeURIComponent(appKey)}` +
      `&autoload=false`;

    console.log("카카오 지도 SDK 요청:", script.src);

    script.onload = () => {
      if (!window.kakao?.maps) {
        reject(new Error("SDK는 로드됐지만 kakao.maps 객체가 없습니다."));
        return;
      }

      window.kakao.maps.load(() => {
        resolve(window.kakao);
      });
    };

    script.onerror = (event) => {
      console.error("카카오 SDK script 오류:", event);

      reject(new Error("카카오 지도 SDK 요청에 실패했습니다."));
    };

    document.head.appendChild(script);
  });
};
