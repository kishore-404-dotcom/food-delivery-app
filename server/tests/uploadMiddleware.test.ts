import express from "express";
import request from "supertest";

import errorMiddleware from "../src/middleware/errorMiddleware";
import upload, {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_FILE_SIZE,
} from "../src/middleware/uploadMiddleware";

const createUploadTestApp = () => {
  const app = express();

  app.post("/upload", upload.single("image"), (req, res) => {
    res.status(200).json({
      success: true,
      mimetype: req.file?.mimetype,
      size: req.file?.size,
    });
  });
  app.use(errorMiddleware);

  return app;
};

describe("image upload middleware", () => {
  const app = createUploadTestApp();

  it.each([
    ["JPG", "image/jpeg"],
    ["PNG", "image/png"],
  ])("accepts a %s image", async (_label, mimetype) => {
    const response = await request(app)
      .post("/upload")
      .attach("image", Buffer.from("valid-image"), {
        filename: `test.${mimetype === "image/png" ? "png" : "jpg"}`,
        contentType: mimetype,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ success: true, mimetype });
  });

  it("rejects an invalid file type with a useful 400 response", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("image", Buffer.from("not-an-image"), {
        filename: "test.txt",
        contentType: "text/plain",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Only JPEG, PNG, and WEBP/i);
  });

  it("rejects an oversized image with a useful 400 response", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("image", Buffer.alloc(MAX_IMAGE_FILE_SIZE + 1), {
        filename: "too-large.jpg",
        contentType: "image/jpeg",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/maximum file size of 5 MB/i);
  });

  it("allows requests without an image", async () => {
    const response = await request(app).post("/upload");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("keeps the documented MIME allowlist", () => {
    expect(ALLOWED_IMAGE_MIME_TYPES).toEqual([
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);
  });
});
