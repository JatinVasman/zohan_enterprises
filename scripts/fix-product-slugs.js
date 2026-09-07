import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.resolve(__dirname, '../src/data/blog');

const slugMap = {
  '35mm-cable-tying-wire-winding-machine': 'ze-35mm-cable-tying-and-wire-winding-machine',
  'automatic-tape-dispenser-z-cut-9': 'ze-zcut9-automatic-tape-dispenser',
  'side-feed-terminal-crimping-feed-applicator': 'ze-sf-side-feed-terminal-crimping-feed-applicator',
  'front-feed-terminal-crimping-feed-applicator': 'ze-fa-front-feed-terminal-crimping-feed-applicator',
  '50kg-thimble-push-pull-tester': 'ze-50kg-push-pull-tester',
  'granulator-ze-100': 'ze-100-electric-copper-granulator-copper-wire-separating-machine',
  'scrap-wire-machine-blade': 'ze-bladex-scrap-wire-machine-blade',
  'ze-15mm-multi-core-cutting-stripping-machine': 'ze-15mm-multi-10-core-cutting-stripping-machine',
  '6mm-fully-automatic-ribbon-wire-cutting-stripping-machine': 'ze-6mm-fully-automatic-ribbon-wire-cutting-stripping-machine',
  'automatic-coaxial-cable-stripping-machine': 'ze-6010-automatic-coaxial-cable-wire-stripping-machine',
  '8mm-automatic-multi-core-cable-cutting-peeling-stripping-machine': 'ze-905-multi-core-cable-automatic-cutting-peeling-stripping-machine',
  'single-wire-pay-off-stand': 'ze-spo100-single-wire-pay-off-stand',
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;
      for (const [oldSlug, newSlug] of Object.entries(slugMap)) {
        if (content.includes(`"${oldSlug}"`)) {
          content = content.replaceAll(`"${oldSlug}"`, `"${newSlug}"`);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated slugs in ${file}`);
      }
    }
  }
}

processDirectory(blogDir);
console.log('Finished updating product slugs.');
