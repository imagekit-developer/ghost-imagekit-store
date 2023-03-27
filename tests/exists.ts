import { expect } from "chai";
import { describe, it } from "mocha";
import nock from "nock";
import { join } from "path";

import { mockImage, mockInexistentImage, sampleConfig } from "./fixtures";
const ImagekitAdapter = require(join(__dirname, "../src/index.ts"));

export const existsTest = () => {
  describe("exists", function () {
    let scope: any;
    let scope2: any;
    let imagekitAdapter: any;
    before("build up", function () {
      imagekitAdapter = new ImagekitAdapter(sampleConfig());
      scope = nock(`http://ik.imagekit.io`)
        .get(`/ghostTesting/${mockImage.targetDir}/${mockImage.name}`)
        .reply(200, "ok").persist();

        scope2 = nock("http://ik.imagekit.io")
        .get(`/ghostTesting/${mockImage.targetDir}/${mockInexistentImage.name}`)
        .reply(404);
      

    });
    after("tear down", () => {
      nock.cleanAll();
    });

    it("returns true when image exists", async function () {
      const exists: boolean = await imagekitAdapter.exists(
        mockImage.name,
        mockImage.targetDir
      );

      expect(exists).to.equals(true);
    });

    it("returns false when image does not exist", async function () {
      const exists: boolean = await imagekitAdapter.exists(
        mockInexistentImage.name,
        mockInexistentImage.targetDir
      );

      expect(exists).to.equals(false);
    });
  });
};

