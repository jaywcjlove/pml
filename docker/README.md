Docker
===

[![Node.js CI](https://github.com/jaywcjlove/pml/actions/workflows/main.yml/badge.svg)](https://github.com/jaywcjlove/pml/actions/workflows/main.yml)
[![Docker Image Version (latest by date)](https://img.shields.io/docker/v/wcjiang/pml)](https://hub.docker.com/r/wcjiang/pml)
[![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/wcjiang/pml)](https://hub.docker.com/r/wcjiang/pml)
[![Docker Pulls](https://img.shields.io/docker/pulls/wcjiang/pml)](https://hub.docker.com/r/wcjiang/pml)

## Docker start service

```bash
$ docker build -t pml .
```

Start the **postgres** container

```bash
docker run \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=wcjiang \
  --name postgres \
  --restart always \
  -d \
  postgres:latest
```

Start the **pml** container

```bash
$ docker run --name pml \
  -p 3560:3002 \
  -e POSTGRES_HOST=192.168.31.179 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=wcjiang \
  -e POSTGRES_DB=pml \
  -d pml
```

## Docker Compose

```yml
version: '3.8'
services:
  postgres:
    image: postgres:latest
    # ports:
    #   - 5432:5432
    environment:
      - POSTGRES_PASSWORD=wcjiang
    restart: always

  pml:
    image: pml:latest
    ports:
      - 3560:3002
    environment:
      - POSTGRES_HOST=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=wcjiang
      - POSTGRES_DB=pml
    depends_on:
      - postgres
```

Run the following command to start the container

```bash
docker-compose --project-name pml-server up -d
docker-compose -p pml-server -f docker-compose.yml down --remove-orphans --rmi local -v
# Or
docker stack deploy -c docker-compose.yml pml-server
```