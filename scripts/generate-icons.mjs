import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

await sharp(path.join(root, 'build', 'icon.svg'))
  .resize(1024, 1024)
  .png()
  .toFile(path.join(root, 'build', 'icon.png'))

console.log('Generated build/icon.png')

