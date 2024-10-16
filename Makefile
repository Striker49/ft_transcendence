start:
	docker-compose up --build
stop:
	docker-compose down
prune:
	docker system prune --all --volumes
delete_volumes:
	make stop
	docker volume ls -q | xargs docker volume rm
fclean:
	make delete_volumes
	docker rmi -f $$(docker images -qa); \
	docker rm -vf $$(docker ps -aq); \
	make prune
eval:
	docker stop $$(docker ps -qa); \
	docker rm $$(docker ps -qa); \
	docker rmi -f $$(docker images -qa); \
	docker volume rm $$(docker volume ls -q); \
	docker network rm $$(docker network ls -q) 2>/dev/null

re:
	make fclean
	make start


# build:
# 	docker-compose build --quiet

# build-hard:
# 	docker-compose build --no-cache

# start:
# 	docker-compose start

# up:
# 	docker-compose up -d

# up-verbose:
# 	docker-compose up	

# stop:
# 	docker-compose stop

# down:
# 	docker-compose down

# down-hard:
# 	docker-compose down -v

# restart:
# 	docker-compose restart

# deploy:
# 	make down
# 	make build-hard
# 	make up-verbose

# eval:
# 	docker stop $$(docker ps -qa); \
# 	docker rm $$(docker ps -qa); \
# 	docker rmi -f $$(docker images -qa); \
# 	docker volume rm $$(docker volume ls -q); \
# 	docker network rm $$(docker network ls -q) 2>/dev/null

# prune:
# 	docker system prune --all --volumes

# fclean:
# 	make delete_volumes
# 	docker rmi -f $$(docker images -qa); \
# 	docker rm -vf $$(docker ps -aq); \
# 	make prune

# .PHONY build build-hard up up-verbose start down down-hard stop restart deploy eval prune fclean
