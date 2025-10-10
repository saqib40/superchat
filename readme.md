```bash
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