import { expect } from "chai";
import { readFile } from "fs/promises";
import nock from "nock";
import { join } from "path";
import { sampleConfig } from "./fixtures";
const ImagekitAdapter = require(join(__dirname, "../src/index.ts"));

export const readTest = () => {
  describe("read", function () {
    let imagekitAdapter: any;
    let scope: any;
    let file: any;
    before("", async () => {
      file = await readFile(join(__dirname, "./data/test_image.jpg"));
      scope = nock("http://ik.imagekit.io/ghostTesting")
        .get("/myimage.jpg")
        .replyWithFile(200, join(__dirname + "/data/test_image.jpg"), {
          "Content-Type": "image/jpg",
        });
    });

    after("", () => {
      nock.cleanAll();
    });

    it("should find the image", async function () {
      imagekitAdapter = new ImagekitAdapter(sampleConfig());

      const options = {
        path: "http://ik.imagekit.io/ghostTesting/myimage.jpg",
      };

      const fileRead = await imagekitAdapter.read(options);

      expect(fileRead.toString()).to.equal(file.toString());
    });

  });
};
