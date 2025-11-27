/**
 * Quick Database Check Script
 * Checks if default categories have enough words for testing
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path (should match Tauri app database location)
const dbPath = join(__dirname, '../../src-tauri/bil_bakalim.db');

console.log('📊 Database Word Count Check\n');
console.log('Database path:', dbPath, '\n');

try {
  const db = new Database(dbPath, { readonly: true });

  // Get all categories
  const categories = db.prepare('SELECT id, name, emoji FROM categories').all();

  console.log('Categories:\n');
  
  categories.forEach((cat) => {
    console.log(`\n${cat.emoji} ${cat.name} (ID: ${cat.id})`);
    console.log('─'.repeat(50));
    
    // Total words
    const total = db.prepare(
      'SELECT COUNT(*) as count FROM words WHERE category_id = ?'
    ).get(cat.id);
    
    console.log(`Total words: ${total.count}`);
    
    // Words by length
    console.log('\nWords by length:');
    for (let length = 4; length <= 10; length++) {
      const count = db.prepare(
        'SELECT COUNT(*) as count FROM words WHERE category_id = ? AND letter_count = ?'
      ).get(cat.id, length);
      
      const status = count.count >= 2 ? '✅' : '❌';
      console.log(`  ${length} letters: ${count.count} words ${status}`);
    }
    
    // Can be used for modes?
    const canSingle = total.count >= 14;
    const canMulti2 = total.count >= 28;
    const canMulti3 = total.count >= 42;
    
    console.log('\nGame mode support:');
    console.log(`  Single player: ${canSingle ? '✅' : '❌'} (needs 14 words)`);
    console.log(`  2 players: ${canMulti2 ? '✅' : '❌'} (needs 28 words)`);
    console.log(`  3 players: ${canMulti3 ? '✅' : '❌'} (needs 42 words)`);
  });

  db.close();
  
  console.log('\n✨ Check complete!\n');
  
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
