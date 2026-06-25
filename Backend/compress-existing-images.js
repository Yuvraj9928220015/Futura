require('dotenv').config();
const mongoose = require('mongoose');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const Product = require('./models/productModels');

const UPLOAD_DIR = path.join(__dirname, 'uploads');

const COMPRESS_CONFIG = {
  maxWidth: 1200,
  webpQuality: 75,
  skipIfSmaller: 50,
};

let stats = {
  totalImages: 0,
  compressed: 0,
  skipped: 0,
  errors: 0,
  savedKB: 0,
};

async function compressImage(oldRelPath) {
  const cleaned = oldRelPath.replace(/\\/g, '/');

  let absPath;

  const fileName = path.basename(cleaned);
  absPath = path.join(UPLOAD_DIR, fileName);

  if (!fs.existsSync(absPath)) {
    console.warn(`File not found: ${absPath}`);
    stats.skipped++;
    return oldRelPath;
  }

  const ext = path.extname(absPath).toLowerCase();

  if (['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv'].includes(ext)) {
    stats.skipped++;
    return oldRelPath;
  }

  const fileSizeKB = fs.statSync(absPath).size / 1024;

  if (fileSizeKB < COMPRESS_CONFIG.skipIfSmaller) {
    console.log(`   ⏩ Skip (already small ${fileSizeKB.toFixed(0)} KB): ${path.basename(absPath)}`);
    stats.skipped++;
    return oldRelPath;
  }

  const baseName = path.basename(absPath, ext);
  const newFileName = `c-${baseName}.webp`;
  const newAbsPath = path.join(UPLOAD_DIR, newFileName);

  try {
    await sharp(absPath)
      .resize({ width: COMPRESS_CONFIG.maxWidth, withoutEnlargement: true })
      .webp({ quality: COMPRESS_CONFIG.webpQuality })
      .toFile(newAbsPath);

    const newSizeKB = fs.statSync(newAbsPath).size / 1024;
    const saved = fileSizeKB - newSizeKB;

    console.log(
      ` ${path.basename(absPath)}  ` +
      `${fileSizeKB.toFixed(0)} KB → ${newSizeKB.toFixed(0)} KB  ` +
      `(saved ${saved.toFixed(0)} KB)`
    );

    fs.unlinkSync(absPath);

    stats.compressed++;
    stats.savedKB += saved;

    return `uploads/${newFileName}`;

  } catch (err) {
    console.error(`   ❌ Error compressing ${path.basename(absPath)}: ${err.message}`);
    stats.errors++;
    return oldRelPath;
  }
}

async function processImageArray(images) {
  if (!images || !Array.isArray(images) || images.length === 0) return images;
  const updated = [];
  for (const img of images) {
    if (!img) { updated.push(img); continue; }
    stats.totalImages++;
    const newPath = await compressImage(img);
    updated.push(newPath);
  }
  return updated;
}

async function run() {
  const MONGO_URL = process.env.MONGO_URL;
  if (!MONGO_URL) {
    console.error('❌ MONGO_URL not found in .env');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URL);
  console.log('Connected\n');

  const products = await Product.find({});
  console.log(`📦 Found ${products.length} products\n`);

  for (const product of products) {
    console.log(`\n🔄 Product: ${product.title || product._id}`);

    let changed = false;

    if (product.image && product.image.length > 0) {
      console.log(`  📸 Main images (${product.image.length})`);
      const updated = await processImageArray(product.image);
      if (JSON.stringify(updated) !== JSON.stringify(product.image)) {
        product.image = updated;
        changed = true;
      }
    }

    if (product.icons && product.icons.length > 0) {
      console.log(`  🔷 Icons (${product.icons.length})`);
      const updated = await processImageArray(product.icons);
      if (JSON.stringify(updated) !== JSON.stringify(product.icons)) {
        product.icons = updated;
        changed = true;
      }
    }

    if (product.swatches && product.swatches.length > 0) {
      console.log(` Swatches (${product.swatches.length})`);
      const updated = await processImageArray(product.swatches);
      if (JSON.stringify(updated) !== JSON.stringify(product.swatches)) {
        product.swatches = updated;
        changed = true;
      }
    }

    if (product.variants && product.variants.length > 0) {
      for (let i = 0; i < product.variants.length; i++) {
        const variant = product.variants[i];
        if (variant.images && variant.images.length > 0) {
          console.log(` Variant "${variant.name}" (${variant.images.length} images)`);
          const updated = await processImageArray(variant.images);
          if (JSON.stringify(updated) !== JSON.stringify(variant.images)) {
            product.variants[i].images = updated;
            changed = true;
          }
        }
      }
    }

    if (changed) {
      product.markModified('image');
      product.markModified('icons');
      product.markModified('swatches');
      product.markModified('variants');
      await product.save();
      console.log(` Saved to DB`);
    } else {
      console.log(` No changes needed`);
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log(' COMPRESSION COMPLETE — SUMMARY');
  console.log('═'.repeat(50));
  console.log(`  Total images scanned : ${stats.totalImages}`);
  console.log(` Compressed        : ${stats.compressed}`);
  console.log(` Skipped           : ${stats.skipped}`);
  console.log(` Errors            : ${stats.errors}`);
  console.log(` Total space saved : ${(stats.savedKB / 1024).toFixed(2)} MB`);
  console.log('═'.repeat(50));

  await mongoose.disconnect();
  console.log('\n🔌 Disconnected from MongoDB. Done!');
}

run().catch(err => {
  console.error('❌ Fatal error:', err);
  mongoose.disconnect();
  process.exit(1);
});