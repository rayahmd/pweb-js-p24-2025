const http = require("http");
const fs = require("fs");
const path = require("path");
const { getRecipes, getRecipeById } = require("./recipes.service");

const PORT = 3000;
const publicDir = path.join(__dirname, "public");

const server = http.createServer(async (req, res) => {
  const url = req.url || "/";

  // === API routes ===
  if (url.startsWith("/api/recipes")) {
    // detail resep: /api/recipes/1
    const match = url.match(/^\/api\/recipes\/(\d+)$/);
    if (match) {
      const id = match[1];
      const recipe = await getRecipeById(id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(recipe));
      return;
    }

    // list resep: /api/recipes
    const recipes = await getRecipes(30, 0);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(recipes));
    return;
  }

  // === Static files ===
  let filePath = path.join(publicDir, url === "/" ? "index.html" : url);
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType =
      ext === ".html" ? "text/html" :
      ext === ".css" ? "text/css" :
      ext === ".js" ? "application/javascript" : "text/plain";

    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not Found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
