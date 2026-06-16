import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function saveUploadedFile(file: File, folder = "uploads") {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = path.extname(file.name);
  const filename = `${randomUUID()}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", folder);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return `/${folder}/${filename}`;
}
