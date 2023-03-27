import chai from "chai";
import { readFile } from "fs/promises";
import Imagekit from "imagekit";
import { join } from "path";
import * as sinon from "sinon";
import { image, sampleConfig } from "./fixtures";
const expect = chai.expect;
const ImagekitAdapter = require(join(__dirname, "../src/index.ts"));

export const saveTest = () => {
  describe("save", function () {
    let sandbox: sinon.SinonSandbox;
    let uploadStub: sinon.SinonStubbedMember<any>;
    let file: any;
    let imagekitAdapter: any;

    before("Build up", async function () {
      file = await readFile(join(__dirname, "./data/test_image.jpg"));
      imagekitAdapter = new ImagekitAdapter(sampleConfig());

      sandbox = sinon.createSandbox();

      uploadStub = sandbox
        .stub(Imagekit.prototype, "upload")
        .resolves({ url: "http://imagekit.io/ghostTesting/test1.jpg" });
    });

    after("Tear down", () => {
      sandbox.restore();
    });

    it("should upload successfully", async function () {

      const response = await imagekitAdapter.save(image, "/");

      expect(
        response.includes("http://imagekit.io/ghostTesting/test1.jpg")
      ).to.equal(true);

      expect(
        uploadStub.calledWith({
          file,
          fileName: "test_image.jpg",
          useUniqueFileName: true,
          folder: "/",
          tags: [],
        })
      ).to.equal(true);
    });
  });
};
