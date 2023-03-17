# ghost-imagekit-store
Ghost imagekit store

### Features

- Up to date with latest Ghost versions :rocket:
- Image upload, existence check
- Ability to upload images into a specific directory
- Ability to tag images

## Installation

### Install using yarn

- Go into Ghost root directory
- Download the adapter:

```bash
yarn add ghost-imagekit-store
mv node_modules/ghost-imagekit-store content/adapters/storage/imagekit
```

- Done, go configure

### Install on Docker

Here's an example of using this adapter with a containerized Ghost:

```Dockerfile
FROM ghost:4-alpine as imagekit
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install
RUN ls -la $GHOST_INSTALL/node_modules/ghost-imagekit-store/dist/src/index.js

FROM ghost:4-alpine
COPY content ./content/
COPY --chown=node:node --from=imagekit $GHOST_INSTALL/node_modules $GHOST_INSTALL/node_modules
COPY --chown=node:node --from=imagekit $GHOST_INSTALL/node_modules/ghost-imagekit-store/dist/src/index.js $GHOST_INSTALL/content/adapters/storage/imagekit/index.js
RUN ls -la ./content/adapters/storage/imagekit
CMD ["node", "current/index.js"]
```
## Configuration
- The `auth` property is necessary
- The optional `upload` property contains Imagekit API [upload options](https://docs.imagekit.io/api-reference/upload-file-api)
### Recommended configuration

- `upload.folder = "my-blog"` allows to upload all your images into a specific directory instead of Imagekit media library root
- `uploadOptions.tags = ["blog", "photography"]` if you want to add some taxonomy to your uploaded images
