import { expect } from "chai";
import nock from "nock";

import ImageKitAdapter from "../../src";
import { mockImage, mockNonExistentImage, testConfig } from "../fixtures";

const imagekitAdapter = new ImageKitAdapter(testConfig());

describe("exists", function () {
  it("Should return true when image exists", async function () {
    nock(`https://ik.imagekit.io`)
      .get(`/test/${mockImage.targetDir}/${mockImage.name}`)
      .reply(200);

    const exists = await imagekitAdapter.exists(
      mockImage.name,
      mockImage.targetDir
    );

    expect(exists).to.equals(true);
  });

  it("Should return false when image does not exist", async function () {
    nock(`https://ik.imagekit.io`)
      .get(
        `/test/${mockNonExistentImage.targetDir}/${mockNonExistentImage.name}`
      )
      .reply(404);

    const exists: boolean = await imagekitAdapter.exists(
      mockNonExistentImage.name,
      mockNonExistentImage.targetDir
    );

    expect(exists).to.equals(false);
  });
});
