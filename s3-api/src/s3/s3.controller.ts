// s3.controller.ts
import { Controller, Get, Post, Query,
   Req, UploadedFile, Res, Param, UseInterceptors, Delete } from '@nestjs/common';
import { Request, Response } from 'express';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('s3')
export class S3Controller {
  private defaultBucketName = 'callitsomethingcool';
  constructor(private readonly s3Service: S3Service) {}
 
  @Get('filenames')
  async listFileNames(@Res() res: Response){
    try{
        
        const filenames = await this.s3Service.listFileNames(this.defaultBucketName);
        console.log(filenames);
        res.status(200).json({filenames});
    } catch (error){
        console.log(error);
        res.status(500).json({error: `Failed to list the files from the bucket :(`,
                              message: error.message,})
    }
  }

  @Get('download/:filename')
  async downloadFile(
    @Param('callitsomethingcool') bucketName: string,
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
        error: `Failed to download ${filename} from  :(`,
        message: error.message,
      });
    }
  }

  @Delete('delete/:filename')
  async deleteFile(
    @Param('callitsomethingcool') bucketName: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      await this.s3Service.deleteFile(bucketName, filename);
      res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: `Failed to delete ${filename} from :(`,
        message: error.message,
      });
    }
  }




}
