import fs from 'fs';
import sharp from 'sharp';

async function main() {
  const svgPath = 'public/favicon.svg';
  const icoPath = 'public/favicon.ico';
  
  // 32x32 の PNG バッファを作成（標準のライトモード配色 #1E3A60 が使われます）
  const pngBuffer = await sharp(svgPath)
    .resize(32, 32)
    .png()
    .toBuffer();

  // ICO ヘッダー (6バイト)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: Icon (1)
  header.writeUInt16LE(1, 4); // Number of images (1)

  // ICO ディレクトリエントリ (16バイト)
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0); // Width (32)
  entry.writeUInt8(32, 1); // Height (32)
  entry.writeUInt8(0, 2);  // Color count (0)
  entry.writeUInt8(0, 3);  // Reserved (0)
  entry.writeUInt16LE(1, 4); // Color planes (1)
  entry.writeUInt16LE(32, 6); // Bits per pixel (32)
  entry.writeUInt32LE(pngBuffer.length, 8); // Image size in bytes
  entry.writeUInt32LE(22, 12); // Image data offset (6 + 16)

  // 結合して書き出し
  const icoBuffer = Buffer.concat([header, entry, pngBuffer]);
  fs.writeFileSync(icoPath, icoBuffer);
  console.log(`Successfully generated ${icoPath} (size: ${icoBuffer.length} bytes)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
