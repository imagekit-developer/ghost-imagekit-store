import { join } from "path";

export function testConfig() {
  return {
    auth: {
      urlEndpoint: "https://ik.imagekit.io/test/",
      privateKey: "dummy-private-key",
      publicKey: "dummy-public-key",
    },
    uploadOptions: {
      useUniqueFileName: true,
      folder: "/",
      tags: [],
    },
    enableDatedFolders: true,
  };
}

export const mockImage = {
  name: "mockImage.png",
  targetDir: "test-folder",
};

export const mockNonExistentImage = {
  name: "mockNonExistentImage.png",
  targetDir: "test-folder",
};

export const image = {
  name: "default-image.jpeg",
  path: join(__dirname, "./default-image.jpeg"),
  type: "image/jpeg",
};

export const uploadResponse = {
  fileId: "643404d3e809dd54b03e0e3e",
  name: "default-image_ZdKLjqU5d.jpeg",
  size: 147022,
  versionInfo: {
    id: "643404d3e809dd54b03e0e3e",
    name: "Version 1",
  },
  filePath: "/default-image_ZdKLjqU5d.jpeg",
  url: "https://ik.imagekit.io/test/default-image_ZdKLjqU5d.jpeg",
  fileType: "image",
  height: 1000,
  width: 1000,
  thumbnailUrl:
    "https://ik.imagekit.io/test/tr:n-ik_ml_thumbnail/default-image_ZdKLjqU5d.jpeg",
  AITags: null,
};
