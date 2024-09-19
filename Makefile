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
