// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/api/": "https://localhost:3443",
//       "/uploads/": "http://localhost:3443",
//     },
//   },
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
     https: { //  Add HTTPS configuration
      key: path.resolve(__dirname, '..', 'server.key'), // Path to your private key
      cert: path.resolve(__dirname, '..', 'server.crt'), // Path to your certificate
    },


    proxy: {
      "/api/": {
        target: "https://localhost:3443",
        changeOrigin: true, // Often useful for proxies
        secure: false,     // 
      },
      "/uploads/": {
        target: "https://localhost:3443",
        changeOrigin: true, // Often useful for proxies
        secure: false,     // 
      },
    },
  },
});