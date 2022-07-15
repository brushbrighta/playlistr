

# Playlistr

This project was generated using [Nx](https://nx.dev).

## Docker Commands

### List images 
<code>docker images</code>

### Check content of image

<code>docker run -it  backend bash</code>

<code>docker run -it  frontend bash</code>

<code>...etc</code>

### Build specific target

<code>docker build --target backend -t backend .</code>

<code>docker build --target frontend -t frontend .</code>

<code>...etc</code>

### Run container
<code>docker run --rm -it -p 3333:3333 backend</code>

<code>docker run --rm -it -p 8080:80 frontend</code>

<code>...etc</code>

### List running containers
#### List all
<code>docker ps -a</code>
#### Only active
<code>docker ps</code>

### Kill all running containers
<code>docker rm -f $(docker ps -q)</code>

### In einen Container hängen
<code>docker-compose exec fe bash</code>
