# ☁️ Cloudinary Integration Setup & Best Practices Guide

This guide details the complete configuration, environment variables, folder hierarchy, security settings, and deployment checklist for Cloudinary Image Uploads in the MERN Food Delivery application.

---

## 📌 STEP 1 — Cloudinary Account Setup

1. **Sign Up / Login:**
   * Create an account at [cloudinary.com](https://cloudinary.com).

2. **Locate Credentials:**
   * Open the **Cloudinary Dashboard**.
   * Copy the following credentials:
     * `Cloud Name`
     * `API Key`
     * `API Secret`

3. **Where Values Are Used:**
   * These credentials are used exclusively in `server/.env` and Render environment variables.
   * **Crucial Security Requirement:** Never expose `CLOUDINARY_API_SECRET` to the frontend React application.

4. **Folder Hierarchy:**
   All media is automatically routed into structured folders:
   ```
   food-delivery/
       ├── restaurants/
       ├── foods/
       └── users/
   ```

5. **Recommended Security Settings:**
   * **Unsigned Uploads Disabled:** All uploads pass through backend authentication (`protect` + `adminOnly`).
   * **Allowed Formats:** Enforce `JPG`, `PNG`, `WEBP` only.
   * **Max File Size:** `5MB` limit enforced by backend Multer middleware.
   * **Auto Optimization:** `quality: "auto", fetch_format: "auto"` applied on upload.

---

## 📌 STEP 2 — Environment Variables

### Local Configuration (`server/.env`)
```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Render Production Configuration
Add the three environment variables under **Render Dashboard -> Environment Secrets**:
* `CLOUDINARY_CLOUD_NAME`
* `CLOUDINARY_API_KEY`
* `CLOUDINARY_API_SECRET`

---

## 📌 STEP 3 — Architecture & Flow

```
[ Frontend React Form ]
        │
        ▼ (FormData - Multipart)
[ Express Upload Middleware ] ──► Validates (MIME type <= 5MB)
        │
        ▼
[ Cloudinary Uploader ] ──► Generates secure_url & public_id
        │
        ▼
[ MongoDB Database ] ──► Stores image URL & public_id reference
```

---

## 📌 STEP 4 — Cloudinary Deletion & Replacement Rules

1. **Replacing Images:** When editing a restaurant or food dish, if a new image file is uploaded, the existing Cloudinary asset is automatically destroyed via `deleteFromCloudinary(existing.imagePublicId)` before saving the new `secure_url` and `public_id`.
2. **Deleting Entities:** Deleting a restaurant or food dish automatically cleans up its associated Cloudinary image asset.

---

## 📌 STEP 5 — Deployment & Verification Checklist

- [x] Cloudinary `cloud_name`, `api_key`, `api_secret` set in server `.env` and Render.
- [x] Backend Multer memory storage configured with 5MB max size and MIME type filter (`image/jpeg`, `image/png`, `image/webp`).
- [x] Admin endpoints protected with `protect` + `adminOnly` middlewares.
- [x] Frontend forms send `FormData` without manual boundary headers.
- [x] Live image previews and validation error toasts displayed to Admin.
- [x] TypeScript build passes without compilation errors (`npm run build`).
