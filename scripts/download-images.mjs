/**
 * Download seed images into public/images/
 * Run: npm run media:download
 */
import { mkdirSync, writeFileSync, existsSync, copyFileSync } from "fs";
import { dirname, join, resolve } from "path";

const PUBLIC = resolve("scripts/.media-cache");

/** Direct Unsplash CDN URLs (Unsplash License) — industrial / manufacturing themed */
const IMAGE_MAP = {
  "images/hero/manufacturing.jpg":
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80",
  "images/og/default.jpg":
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
  "images/products/packaging-1.jpg":
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80",
  "images/products/packaging-1b.jpg":
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80",
  "images/products/packaging-2.jpg":
    "https://images.unsplash.com/photo-1596464716127-f829a8295602?auto=format&fit=crop&w=1200&q=80",
  "images/products/industrial-1.jpg":
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
  "images/products/industrial-2.jpg":
    "https://images.unsplash.com/photo-1537462710889-5a9436e09530?auto=format&fit=crop&w=1200&q=80",
  "images/products/hdpe-1.jpg":
    "https://images.unsplash.com/photo-1612815154859-874285288eee?auto=format&fit=crop&w=1200&q=80",
  "images/products/hdpe-2.jpg":
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
  "images/products/ldpe-1.jpg":
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
  "images/products/ldpe-2.jpg":
    "https://images.unsplash.com/photo-1586528116311-ad8dd90c00d4?auto=format&fit=crop&w=1200&q=80",
  "images/products/flexible-1.jpg":
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=80",
  "images/products/flexible-2.jpg":
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
  "images/products/custom-1.jpg":
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
  "images/products/custom-2.jpg":
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  "images/products/components-1.jpg":
    "https://images.unsplash.com/photo-1565043587474-2f0f1a5c5c5c?auto=format&fit=crop&w=1200&q=80",
  "images/products/components-2.jpg":
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80",
  "images/products/protective-1.jpg":
    "https://images.unsplash.com/photo-1586528116311-ad8dd90c00d4?auto=format&fit=crop&w=1200&q=80",
  "images/products/protective-2.jpg":
    "https://images.unsplash.com/photo-1607082348824-0a960f2fd4f9?auto=format&fit=crop&w=1200&q=80",
  "images/infrastructure/plant.jpg":
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
  "images/infrastructure/machinery.jpg":
    "https://images.unsplash.com/photo-1565043587474-2f0f1a5c5c5c?auto=format&fit=crop&w=1200&q=80",
  "images/infrastructure/warehouse.jpg":
    "https://images.unsplash.com/photo-1586528116311-ad8dd90c00d4?auto=format&fit=crop&w=1200&q=80",
  "images/infrastructure/production.jpg":
    "https://images.unsplash.com/photo-1537462710889-5a9436e09530?auto=format&fit=crop&w=1200&q=80",
  "images/infrastructure/lab.jpg":
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
  "images/infrastructure/automation.jpg":
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
  "images/gallery/factory-1.jpg":
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
  "images/gallery/factory-2.jpg":
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
  "images/gallery/products-1.jpg":
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80",
  "images/gallery/products-2.jpg":
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80",
  "images/gallery/machines-1.jpg":
    "https://images.unsplash.com/photo-1565043587474-2f0f1a5c5c5c?auto=format&fit=crop&w=1200&q=80",
  "images/gallery/machines-2.jpg":
    "https://images.unsplash.com/photo-1537462710889-5a9436e09530?auto=format&fit=crop&w=1200&q=80",
  "images/gallery/team-1.jpg":
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  "images/gallery/team-2.jpg":
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80",
  "images/gallery/warehouse-1.jpg":
    "https://images.unsplash.com/photo-1586528116311-ad8dd90c00d4?auto=format&fit=crop&w=1200&q=80",
  "images/gallery/warehouse-2.jpg":
    "https://images.unsplash.com/photo-1607082348824-0a960f2fd4f9?auto=format&fit=crop&w=1200&q=80",
  "images/blog/blog-1.jpg":
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
  "images/blog/blog-2.jpg":
    "https://images.unsplash.com/photo-1612815154859-874285288eee?auto=format&fit=crop&w=1200&q=80",
  "images/blog/blog-3.jpg":
    "https://images.unsplash.com/photo-1537462710889-5a9436e09530?auto=format&fit=crop&w=1200&q=80",
  "images/blog/blog-4.jpg":
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
  "images/certificates/iso.jpg":
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
  "images/certificates/msme.jpg":
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
  "images/certificates/gst.jpg":
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
  "images/certificates/quality.jpg":
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
};

async function downloadImage(relativePath, url) {
  const dest = join(PUBLIC, relativePath);
  mkdirSync(dirname(dest), { recursive: true });

  const res = await fetch(url, {
    headers: { "User-Agent": "PacnixIndia/1.0 (seed script)" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buffer);
  console.log(`  ✓ ${relativePath}`);
}

async function main() {
  console.log(`Downloading ${Object.keys(IMAGE_MAP).length} images to scripts/.media-cache/...\n`);
  let ok = 0;
  let fail = 0;

  for (const [path, url] of Object.entries(IMAGE_MAP)) {
    const dest = join(PUBLIC, path);
    try {
      await downloadImage(path, url);
      ok++;
    } catch (err) {
      const fallback = join(PUBLIC, "images/hero/manufacturing.jpg");
      if (existsSync(fallback)) {
        mkdirSync(dirname(dest), { recursive: true });
        copyFileSync(fallback, dest);
        console.log(`  ~ ${path} (fallback copy)`);
        ok++;
      } else {
        fail++;
        console.error(`  ✗ ${path}: ${err.message}`);
      }
    }
  }

  console.log(`\nDone: ${ok} ok, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

main();
