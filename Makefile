build:
	docker-compose build --quiet

build-hard:
	docker-compose build --no-cache

start:
	docker-compose start

up:
	docker-compose up -d

up-shell:
	docker-compose up 	

stop:
	docker-compose stop

down:
	docker-compose down

down-hard:
	docker-compose down -v

restart:
	docker-compose restart

deploy:
	make down
	make build-hard
	make up-shell

dev:
	make down
	make build
	make up

eval:
	docker stop $$(docker ps -qa); \
	docker rm $$(docker ps -qa); \
	docker rmi -f $$(docker images -qa); \
	docker volume rm $$(docker volume ls -q); \
	docker network rm $$(docker network ls -q) 2>/dev/null

clean:
	docker rmi $$(docker images -f "dangling=true" -q)

prune:
	docker system prune --all --volumes

fclean:
	docker stop $$(docker ps -qa); \
	docker volume rm $$(docker volume ls -q); \
	docker rmi -f $$(docker images -qa); \
	docker rm -vf $$(docker ps -aq); \
	make prune

.PHONY : build build-hard up up-verbose start down down-hard stop restart deploy eval prune fclean