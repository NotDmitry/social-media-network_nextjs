# Social Media Network NextJS

## Deployment

### NextJS project

[Vercel Deployment link](https://social-media-network-nextjs.vercel.app/)

### Source React project

[Vercel Deployment link(new)](https://social-media-network-swart.vercel.app/)

[GH-Pages Deployment link(old)](https://notdmitry.github.io/social-media-network/)

## Docker local run instruction

Some things to consider:
- The development and production images both contain `frontend` and `backend` containers as services.
- The backend containers utilize volumes for storing database entries. To remove them when deleting
containers add `-v` flag to the command.
- Local development and production both run on `localhost:3000`. Avoid simultaneous start in different modes.
- Before switching between production and development you should sign out from the active session.
If you didn't and you encountered the problems - remove accessToken from localStorage
(additionally clear the cookies with refresh token)

### Production

Build the image and run both containers in attached mode:

```bash
docker compose --profile prod up --build
```

Run the already built image in attached mode:

```bash
docker compose --profile prod up --no-build
```

Build the image and run both containers in detached mode:

```bash
docker compose --profile prod up -d --build
```

Run the already built image in detached mode:

```bash
docker compose --profile prod up -d --no-build
```

Stop the containers without removal:

```bash
docker compose --profile prod stop
```

Resume previously stopped containers:

```bash
docker compose --profile prod start
```

Remove the containers without deleting database volumes:

```bash
docker compose --profile prod down
```

Remove the containers with database volumes:

```bash
docker compose --profile prod down -v
```

### Development

Build the image and run both containers in attached mode with watch:

```bash
docker compose --profile dev up --build --watch
```

Run with watch without forcing the build:

```bash
docker compose --profile dev up --watch
```

Build the image and run both containers in detached mode without watch:

```bash
docker compose --profile dev up -d --build
```

Run the already built image in detached mode without watch:

```bash
docker compose --profile dev up -d --no-build
```

Stop the containers without removal:

```bash
docker compose --profile dev stop
```

Resume previously stopped containers:

```bash
docker compose --profile dev start
```

Remove the containers without deleting database volumes:

```bash
docker compose --profile dev down
```

Remove the containers with database volumes:

```bash
docker compose --profile dev down -v
```
