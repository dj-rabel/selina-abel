const fs = require('fs');
const path = require('path');
const express = require('express');
const { createServer: createViteServer } = require('vite');

const app = express();

// Create Vite server in middleware mode. This disables Vite's own HTML
// serving logic and let the parent server take control.
//
// In middleware mode, if you want to use Vite's own HTML serving logic
// use `'html'` as the `middlewareMode` (ref https://vitejs.dev/config/#server-middlewaremode)
const vite = await createViteServer({
  server: { middlewareMode: 'ssr' },
});
// use vite's connect instance as middleware
app.use(vite.middlewares);

app.use('*', async (req, res) => {
  // serve index.html - we will tackle this next
});

app.listen(3000);
