import { Router } from "express";
import multer from "multer";
import {
  uploadFile,
  getFilesByMoneyLocationId,
  getFileById,
  deleteFile,
  renameFile,
} from "../db/files-utils.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// POST: Upload files for a money location (protected)
router.post(
  "/upload/:money_location_id",
  authenticateToken,
  upload.array("files", 10),
  async (req, res) => {
    try {
      const { money_location_id } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const userId = (req as any).user.userId;
      const uploadedFileIds: string[] = [];

      for (const file of files) {
        const fileId = await uploadFile(userId, money_location_id, {
          originalName: file.originalname,
          buffer: file.buffer,
          size: file.size,
          mimeType: file.mimetype,
        });
        uploadedFileIds.push(fileId);
      }

      res.json({
        success: true,
        data: {
          uploadedFiles: uploadedFileIds.length,
          fileIds: uploadedFileIds,
        },
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload files",
      });
    }
  }
);

// GET: List files for a money location
router.get("/:money_location_id", authenticateToken, async (req, res) => {
  try {
    const { money_location_id } = req.params;
    const userId = (req as any).user.userId;

    const files = await getFilesByMoneyLocationId(userId, money_location_id);
    res.json({ success: true, data: files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch files",
    });
  }
});

// GET: Download a file by ID
router.get("/download/:file_id", authenticateToken, async (req, res) => {
  try {
    const { file_id } = req.params;
    const userId = (req as any).user.userId;

    const file = await getFileById(userId, file_id);

    if (!file || !file.file_data) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Ensure we have a Buffer
    const fileBuffer = Buffer.isBuffer(file.file_data)
      ? file.file_data
      : Buffer.from(file.file_data);

    // Properly encode filename for Hebrew and other UTF-8 characters
    const encodedFilename = encodeURIComponent(file.original_name);

    res.set({
      "Content-Type": file.mime_type,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodedFilename}`,
      "Content-Length": fileBuffer.length.toString(),
      "Cache-Control": "no-cache",
    });

    res.end(fileBuffer);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({
      success: false,
      message: "Failed to download file",
    });
  }
});

// PUT: Rename a file
router.put("/rename/:file_id", authenticateToken, async (req, res) => {
  try {
    const { file_id } = req.params;
    const { newName } = req.body;
    const userId = (req as any).user.userId;

    if (!newName || newName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Invalid file name",
      });
    }

    const success = await renameFile(userId, file_id, newName.trim());

    if (!success) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.json({
      success: true,
      message: "File renamed successfully",
    });
  } catch (error) {
    console.error("Error renaming file:", error);
    res.status(500).json({
      success: false,
      message: "Failed to rename file",
    });
  }
});

// DELETE: Delete a file
router.delete("/:file_id", authenticateToken, async (req, res) => {
  try {
    const { file_id } = req.params;
    const userId = (req as any).user.userId;

    const success = await deleteFile(userId, file_id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete file",
    });
  }
});

export default router;
