import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [
        vue(),
        VitePWA({ 
            registerType: "autoUpdate",
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"]
            },
            manifest: {
                id: "com.htmlanimator.app",
                name: "HTML Animator",
                short_name: "HTML Animator",
                description: "Create HTML and SVG animations online without writing code.",
                theme_color: "#000000",
                background_color: "#FFFFFF",
                display: "standalone",
                display_override: [
                    "standalone",
                    "minimal-ui",
                    "window-controls-overlay"
                ],
                start_url: "/",
                icons: [
                    {
                        "src": "/favicon.png",
                        "sizes": "48x48",
                        "type": "image/png"
                    },
                    {
                        "src": "/favicon-180x180.png",
                        "sizes": "180x180",
                        "type": "image/png"
                    },
                    {
                        "src": "/favicon-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": "/favicon-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png"                        ,
                        "purpose": "any"
                    },
                    {
                        "src": "/favicon-maskable-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "maskable"
                    }
                ],
                screenshots: [
                ],
                related_applications: [
                ],
                categories: ["entertainment"],
            }
        })
    ]
});
