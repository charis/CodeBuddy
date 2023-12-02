-----------------
   S T E P   1   
-----------------
Run
$ npm i prisma

-----------------
   S T E P   2   
-----------------
Run
$ npx prisma init

-----------------
   S T E P   3   
-----------------
Edit the contnent for the prisma schema file (i.e., schema.prisma)

1) For SQLITE this file starts with:
- - - - - - - - - - - - - - - - - - - - - - -
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
- - - - - - - - - - - - - - - - - - - - - - -

2) For PostgraSQL (supabase) this file starts with:
- - - - - - - - - - - - - - - - - - - - - - -
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  directUrl         = env("DIRECT_URL")
}
- - - - - - - - - - - - - - - - - - - - - - -

-----------------
   S T E P   4  
-----------------
1) For SQLITE, add the following variables to the .env file:
DATABASE_URL = file:./dev.db


2) For PostgraSQL, add the following variables to the .env file:
# PostgreSQL connection string used for migrations
DIRECT_URL = postgres://postgres:[DB PASSWORD].brqiqiuwaohenfzhozlq.supabase.co:5432/postgres

# PostgreSQL connection string with pgBouncer config — used by Prisma Client
DATABASE_URL = postgres://postgres:[DB PASSWORD]@db.brqiqiuwaohenfzhozlq.supabase.co:5432/postgres?pgbouncer=true

where the [DB PASSWORD] should be replaced by the database password

-----------------
   S T E P   5  
-----------------
Run
$ npx prisma migrate dev --name init
This will create a 'migrations' subfolder in folder 'prisma'
It will also create the DB tables:

1) For SQLITE, in the local db file.

2) For PostgraSQL, go to supabase website and see under 'Database'

-----------------
   S T E P   6  
-----------------
Initializing the DB tables:

1) For SQLITE, do the following:
1st Way: Preferred
- Open package.json and add somewhere in this file (e.g. under "scripts:{}"):
  "prisma": {
    "seed": "node prisma/seed.js"
  },
- Run
  $ npx prisma db seed
  This invokes prisma/seed.js which in turn executes the commands in
  prisma/seed.sql that add entries to the database
  
2nd Way: Manually
- Open a terminal and navigate to the prisma directory (i.e., 'cd prisma')
- Run
$ sqlite3 dev.db
$ .read seed.sql
$ .quit

2) For PostgraSQL, do the following:
- Go to the supabase website, select the database and on the left sidebar, click on 'Table Editor'.
- From the tables, select 'Problem'
- Click 'Insert' -> 'Import data fromCSV'
- Drag and drop file 'Problem_rows.csv'. It will preview the data that will be inserted.
- Click on button 'Import data'