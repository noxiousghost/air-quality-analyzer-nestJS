import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';

// File type validation
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const allowedTypes = /csv/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  if (mimeType && extname) {
    return callback(null, true);
  } else {
    return callback(
      new BadRequestException('Invalid file type, only CSV files are allowed!'),
      false,
    );
  }
};

// Storage configuration
export const storage = diskStorage({
  destination: (req, file, callback) => {
    const uploadPath = path.join('uploads');
    fs.promises
      .mkdir(uploadPath, { recursive: true })
      .then(() => callback(null, uploadPath))
      .catch((err) => callback(err, uploadPath));
  },
  filename: (req, file, callback) => {
    const newFileName = `${Date.now()}-${file.originalname.trim()}`;
    callback(null, newFileName);
  },
});

export const multerConfig = {
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1 GB limit
  },
};
