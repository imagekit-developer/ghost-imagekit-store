# Ghost Imagekit Store
A fully featured and deeply tested [Imagekit](https://imagekit.io/) [Ghost](https://github.com/TryGhost/Ghost) storage adapter.

### Features

- Up to date with latest Ghost versions
- Image upload, existence check, static serve
- Ability to upload images into a specific directory
- Ability to tag images

## Installation

### Install using yarn

- Go into Ghost root directory
- Download the adapter:

```bash
yarn add ghost-imagekit-store
cp node_modules/ghost-imagekit-store/dist/src/index.js content/adapters/storage/imagekit/
```

- Next change the config file of ghost. Make sure to set the content path right as well.

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
Check out [configuration.json.dist](configuration.json.dist) for a complete example.
- The `auth` property is necessary and it includes `urlEndpoint`, `privateKey` and `publicKey` which can found in [developer options](https://imagekit.io/dashboard/developer/api-keys) in your Imagekit Dashboard.
- The `upload` property contains optional fields `useUniqueFileName` (default value is false), `tags` and `folder` Imagekit API [upload options](https://docs.imagekit.io/api-reference/upload-file-api)
### Recommended configuration

- `uploadOptions.folder = "test"` allows to upload all your images into a specific directory instead of Imagekit media library root
- `uploadOptions.tags = ["cat", "photo"]` if you want to add some tags to your uploaded images
