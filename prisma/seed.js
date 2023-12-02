const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Loads the data in load_data.sql to the database
async function main() {
    const db = new sqlite3.Database('./prisma/dev.db');

    try {
        const seedSQL = fs.readFileSync('./prisma/seed.sql', 'utf-8');
        const statements = seedSQL.split(';').filter(statement => statement.trim() !== '');
    
        for (const statement of statements) {
          db.run(statement);
        }
        console.log('Data from seed.sql loaded successfully.');
    }
    catch (error) {
        console.error('Error loading data:', error);
    }
    finally {
        db.close();
    }
}

main().catch((error) => {
    console.error('Fatal error during seeding:', error);
});