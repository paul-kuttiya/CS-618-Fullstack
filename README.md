# CS-618-Fullstack

## Run MongoDB
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  mongo:latest
```

Then connect to MongoDB via connection string with `mongodb://localhost:27017`

DB name is mongodb
```
use mongodb
```

insert sample users
```
db.users.insertMany([
  { name: "Alice", email: "alice@example.com", age: 25 },
  { name: "Bob", email: "bob@example.com", age: 30 }
])
```

verify users
```
db.users.find().pretty()
```

## Run Backend
```bash
node backend/main.js
```

## Run Frontend (vite)
```bash
npm run dev
```