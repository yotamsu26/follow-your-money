import { client, FileData, connect } from "./database-schemas.js";
import { v4 as uuidv4 } from "uuid";
import { gzip, gunzip } from "zlib";
import { promisify } from "util";

export async function uploadFile(
  userId: string,
  moneyLocationId: string,
  file: {
    originalName: string;
    buffer: Buffer;
    size: number;
    mimeType: string;
  }
): Promise<string> {
  try {
    await connect();
    const database = client.db("WealthTracker");
    const filesCollection = database.collection<FileData>("Files");

    const fileId = uuidv4();
    const fileName = `${fileId}_${file.originalName}`;

    const gzipAsync = promisify(gzip);
    const compressedBuffer = await gzipAsync(file.buffer);

    const fileData: FileData = {
      file_id: fileId,
      user_id: userId,
      money_location_id: moneyLocationId,
      original_name: file.originalName,
      file_name: fileName,
      file_size: file.size,
      mime_type: file.mimeType,
      file_data: compressedBuffer,
      uploaded_at: new Date(),
    };

    await filesCollection.insertOne(fileData);
    client.close();
    return fileId;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function getFilesByMoneyLocationId(
  userId: string,
  moneyLocationId: string
): Promise<Omit<FileData, "file_data">[]> {
  try {
    await connect();
    const database = client.db("WealthTracker");
    const filesCollection = database.collection<FileData>("Files");

    const files = await filesCollection
      .find(
        { user_id: userId, money_location_id: moneyLocationId },
        { projection: { file_data: 0 } }
      )
      .toArray();

    client.close();
    return files;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
}

export async function getFileById(
  userId: string,
  fileId: string
): Promise<FileData | null> {
  try {
    await connect();
    const database = client.db("WealthTracker");
    const filesCollection = database.collection<FileData>("Files");

    const file = await filesCollection.findOne({
      file_id: fileId,
      user_id: userId,
    });

    if (file && file.file_data) {
      // Ensure file_data is a proper Buffer
      if ((file.file_data as any)._bsontype === "Binary") {
        file.file_data = Buffer.from((file.file_data as any).buffer);
      }

      try {
        const gunzipAsync = promisify(gunzip);
        const decompressedBuffer = await gunzipAsync(file.file_data);

        client.close();

        return {
          ...file,
          file_data: decompressedBuffer,
        };
      } catch (error) {
        client.close();
        return file;
      }
    } else {
      client.close();
      return null;
    }
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
}

export async function deleteFile(
  userId: string,
  fileId: string
): Promise<boolean> {
  try {
    await connect();
    const database = client.db("WealthTracker");
    const filesCollection = database.collection<FileData>("Files");

    const result = await filesCollection.deleteOne({
      file_id: fileId,
      user_id: userId,
    });

    client.close();
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

export async function renameFile(
  userId: string,
  fileId: string,
  newName: string
): Promise<boolean> {
  try {
    await connect();
    const database = client.db("WealthTracker");
    const filesCollection = database.collection<FileData>("Files");

    const result = await filesCollection.updateOne(
      { file_id: fileId, user_id: userId },
      { $set: { original_name: newName } }
    );

    client.close();
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error renaming file:", error);
    throw error;
  }
}

export async function deleteFilesByMoneyLocationId(
  userId: string,
  moneyLocationId: string
): Promise<number> {
  try {
    await connect();
    const database = client.db("WealthTracker");
    const filesCollection = database.collection<FileData>("Files");

    const result = await filesCollection.deleteMany({
      user_id: userId,
      money_location_id: moneyLocationId,
    });

    client.close();
    return result.deletedCount;
  } catch (error) {
    console.error("Error deleting files:", error);
    throw error;
  }
}
