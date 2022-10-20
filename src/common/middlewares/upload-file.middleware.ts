import multer, {diskStorage} from 'multer';
import mime from 'mime';
import {NextFunction, Request, Response} from 'express';
import {nanoid} from 'nanoid';
import {MiddlewareInterface} from '../../types/middleware.interface.js';
import { VALID_IMAGE_EXTENSIONS } from '../../modules/user/user.constant.js';

export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const extension = mime.extension(file.mimetype) ?? '';
        const filename = nanoid();

        if (!VALID_IMAGE_EXTENSIONS.includes(extension)) {
          return callback(
            new Error('Invalid file format. Only .jpg/.jpeg and .png files are acceptable.'),
            `${filename}.${extension}`
          );
        }

        callback(null, `${filename}.${extension}`);
      }
    });

    const uploadSingleFileMiddleware = multer({storage})
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
