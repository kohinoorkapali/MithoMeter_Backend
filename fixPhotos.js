import { Restaurant } from "./models/Restaurant.js";

const normalizePath = (p) => {
  if (!p) return "";

  let path = p.replace(/\\/g, "/");

  const index = path.indexOf("/uploads/");
  if (index !== -1) {
    path = path.substring(index);
  }

  path = path.replace(/(\/uploads\/)+/g, "/uploads/");
  path = path.replace(/\/{2,}/g, "/");

  return path;
};

async function fix() {
  const restaurants = await Restaurant.findAll();

  for (const r of restaurants) {
    if (!r.photos) continue;

    const fixed = r.photos.map(normalizePath);

    await r.update({ photos: fixed });

    console.log("Fixed:", fixed);
  }

  process.exit();
}

fix();
