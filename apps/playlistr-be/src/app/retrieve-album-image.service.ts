import { Injectable, Logger } from '@nestjs/common';
import { Release } from '@playlistr/shared/types';
import { join } from 'path';
import axios from 'axios';
import * as fs from 'fs';
import { DataAccessService } from './data.access.service';
import * as puppeteer from 'puppeteer';

async function downloadImage(url, filepath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on('error', reject)
      .once('close', () => resolve(filepath));
  });
}

@Injectable()
export class RetrieveAlbumImageService {
  constructor(private dataAccessService: DataAccessService) {}

  async addImage(id: string) {
    const _id: number = parseInt(id, 10);
    const collectionJsonRaw =
      this.dataAccessService.getCollectionReleasesJson();
    const collectionJson: Release[] =
      collectionJsonRaw && collectionJsonRaw.length
        ? JSON.parse(collectionJsonRaw)
        : '';

    try {
      const url = collectionJson.find((c) => c.id === _id).uri;
      // Initialize Puppeteer
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Specify comic issue page url
      await page.goto(url);
      Logger.log('page has been loaded!');

      // While page is waiting for 1s, click on the 'Full Chapter' button and do the rest
      // await page.waitFor(1000);

      // Evaluate/Compute the main task:
      // Here, we convert the Nodelist of images returned from the DOM into an array, then map each item and get the src attribute value, and store it in 'src' variable, which is therefore returned to be the value of 'issueSrcs' variable.
      const issueSrcs = await page.evaluate(() => {
        const srcs = Array.from(document.querySelector('picture').children).map(
          (image) => image.getAttribute('src')
        );
        return srcs;
      });
      Logger.log('Page has been evaluated!');

      // Persist data into data.json file
      // fs.writeFileSync('./data.json', JSON.stringify(issueSrcs));
      Logger.log('File is created!');

      // End Puppeteer

      await browser.close();

      try {
        downloadImage(
          issueSrcs[0],
          join(process.cwd(), 'data/images', `${id}.png`)
        );
      } catch (error) {
        Logger.log(error);
      }
    } catch (error) {
      Logger.log(error);
    }

    return null;
  }
}
