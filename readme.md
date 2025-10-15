```bash
# steps to run this project

# clone
git clone https://github.com/Rohitpatilexe/superchat

# get into directory
cd superchat

# then create .env file following .env.example in  =

# then

# First Time Running (or After Code Changes)
docker-compose up --build

# then if you wanna do it again
docker-compose up
# or
docker-compose up -d # detached mode

# to remove containers
docker-compose down
# or
docker-compose down -v # includes volumes as well
```


***Note*** :- You need to update this thing before running via docker compose
```javascript
// in the frontend/src/environments
// update
apiUrl: 'http://localhost:5138/api'
// to
apiUrl: 'http://localhost:8081/api'
```