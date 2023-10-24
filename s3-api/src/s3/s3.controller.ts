// s3.controller.ts
import { Controller, Get, Post, Req, UploadedFile, Res, Param, UseInterceptors, Delete } from '@nestjs/common';
import { Request, Response } from 'express';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}
 
  @Get('filenames/:bucketName')
  async listFileNames(@Param('bucketName') bucketName: string, @Res() res: Response){
    try{
        
        const filenames = await this.s3Service.listFileNames(bucketName);
        console.log(filenames);
        res.status(200).json({filenames});
    } catch (error){
        console.log(error);
        res.status(500).json({error: `Failed to list the files from ${bucketName} :(`,
                              message: error.message,})
    }
  }

  @Get('download/:bucketName/:filename')
  async downloadFile(
    @Param('bucketName') bucketName: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const fileStream = await this.s3Service.downloadFile(bucketName, filename);

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/octet-stream');

      fileStream.pipe(res);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: `Failed to download ${filename} from ${bucketName} :(`,
        message: error.message,
      });
    }
  }

  @Delete('delete/:bucketName/:filename')
  async deleteFile(
    @Param('bucketName') bucketName: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      await this.s3Service.deleteFile(bucketName, filename);
      res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: `Failed to delete ${filename} from ${bucketName} :(`,
        message: error.message,
      });
    }
  }




}
