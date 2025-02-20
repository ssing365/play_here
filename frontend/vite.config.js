import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    // 현재 모드에 맞는 .env 파일의 변수들을 불러옵니다.
    const env = loadEnv(mode, process.cwd(), "");
    const remoteIp = env.VITE_REMOTE_IP;
    const port = env.VITE_PORT;

    return {
        server: {
            proxy: {
                "/api": {
                    target: `http://${remoteIp}:${port}`, // 스프링 서버 주소
                    changeOrigin: true,
                    secure: false,
                    //rewrite: (path) => path.replace(/^\/api/, ''),
                    cookieDomainRewrite: "localhost", // 쿠키 도메인을 클라이언트 도메인으로 재작성
                },
            },
        },
        plugins: [react()],
        base: "./",
    };
});
