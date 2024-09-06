start: dir
	cd srcs/ && \
	docker-compose up --build
stop:
	cd srcs/ && \
	docker-compose down
prune:
	docker system prune --all --volumes
delete_volumes:
	make stop
	docker volume ls -q | xargs docker volume rm
exec_mariadb:
	docker exec -it mariadb sh
exec_wp:
	docker exec -it wordpress sh
fclean:
	make delete_volumes
	rm -rf /home/$(USER)/data/mariadb
	rm -rf /home/$(USER)/data/wordpress
	docker rmi -f $$(docker images -qa); \
	docker rm -vf $$(docker ps -aq); \
	make prune
eval:
	docker stop $$(docker ps -qa); \
	docker rm $$(docker ps -qa); \
	docker rmi -f $$(docker images -qa); \
	docker volume rm $$(docker volume ls -q); \
	docker network rm $$(docker network ls -q) 2>/dev/null

dir:
	# mkdir -p /home/$(USER)/data/mariadb
	# mkdir -p /home/$(USER)/data/wordpress
	# chmod 777 /home/$(USER)/data/mariadb
	# chmod 777 /home/$(USER)/data/wordpress

re:
	make fclean
	make start
