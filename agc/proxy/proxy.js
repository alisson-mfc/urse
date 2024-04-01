const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(
  "/api/*",
  createProxyMiddleware({
    target: `http://localhost:5050`,
    changeOrigin: true,
    pathRewrite: {
      "^/api/": "/",
    },
  })
);
app.get(
  "/api/*",
  createProxyMiddleware({
    target: `http://localhost:5050`,
    changeOrigin: true,
    pathRewrite: {
      "^/api/": "/",
    },
  })
);
app.post(
  "/api/*",
  createProxyMiddleware({
    target: `http://localhost:5050`,
    changeOrigin: true,
  })
);
app.listen(4000, "0.0.0.0", () => {
  console.log("RUN");
});
