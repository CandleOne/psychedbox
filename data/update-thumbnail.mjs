import Database from "better-sqlite3";
const db = new Database("/app/data/psychedbox.db");
db.prepare("UPDATE blog_posts SET image = ?, updated_at = datetime('now') WHERE slug = ?")
  .run("/uploads/podcast-blog-thumbnail.jpg", "top-psychedelic-podcasts-changing-the-narrative");
console.log("Production DB updated - thumbnail changed");
db.close();
