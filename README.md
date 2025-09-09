# Expense Tracker Project

## STDxxxxx
```.txt
STD24162
STD24...
STD24...
STD24...
```

## Installation

- Open your terminal.
- Navigate to the `back` folder and install all dependencies:

```.bash
cd .\back
npm run install-all
```

- Navigate to the `frontend` folder and install all dependencies:

```.bash
cd ../frontend
npm install
```

## Create database
- Create database
- Connect to this database
- Create table
   [
      Copy content of file `/back/database.sql` into your postgresql
   ]

```.sql
CREATE DATABASE expense_tracker;
\c expense_tracker
```

## Run application
```.bash
npm run dev:all
```

## Scripts
```.txt
   ========================================================
   |        Command          |        Description         |
   |          ||             |             ||             |
             _||_            |            _||_
              \/             |             \/
   |=========================+============================|
---|  npm run dev:server     |  Run server only           |---
   |-------------------------+----------------------------|
---|  npm run dev:client     |  Run client interface only |---
   |-------------------------+----------------------------|
---|  npm ru dev:all         |  Run                       |---
   ========================================================
```