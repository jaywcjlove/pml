
```bash
$ cd docker/
$ docker build -t pml .
```

```bash
$ docker run --name pml \
  -p 3560:3002 \
  -e POSTGRES_HOST=192.168.31.179 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=wcjiang \
  -e POSTGRES_DB=pml \
  -d pml
```