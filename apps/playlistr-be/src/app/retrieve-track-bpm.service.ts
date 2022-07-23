import { Injectable, Logger } from '@nestjs/common';
import { Release } from '@playlistr/shared/types';
import { DataAccessService } from './data-access/data.access.service';
import * as puppeteer from 'puppeteer';
import { Observable, of } from 'rxjs';

let SEARCH_STRING;

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

@Injectable()
export class RetrieveTrackBpmService {
  serviceUrl = 'https://songbpm.com/';

  constructor(private dataAccessService: DataAccessService) {}

  async retrieveBpm(id: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      let parsedBpm: string;

      const _id: number = parseInt(id, 10);
      const collectionJsonRaw =
        this.dataAccessService.getCollectionReleasesJson();
      const collectionJson: Release[] =
        collectionJsonRaw && collectionJsonRaw.length
          ? JSON.parse(collectionJsonRaw)
          : '';

      try {
        const data: Release = collectionJson.find((c) => c.id === _id);
        const search_string: string = (SEARCH_STRING = [
          data.artists[0].name,
          data.tracklist[1].title,
        ].join(' '));
        // Initialize Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Specify page url
        await page.goto(this.serviceUrl);
        Logger.log('page has been loaded!');

        await page.waitForSelector('input[name="query"]');
        Logger.log('try searching for', SEARCH_STRING);

        await page.$eval(
          'button[name=search]',
          (el: HTMLInputElement, search) => (el.value = search),
          search_string
        );
        await page.focus('input[name="query"]');
        await page.type('input[name="query"]', search_string);
        await page.keyboard.press('Enter'); // Enter Key
        await page.click('button[name="search"]');

        Logger.log('searched for', SEARCH_STRING);

        await delay(5000);

        try {
          await page.waitForXPath("//span [(text() = 'BPM')]");
          const bpmLabels = await page.$x("//span[(text() = 'BPM')]");

          Logger.log('bpmLabel', bpmLabels);

          const parent_node = (await bpmLabels[0].$x('..'))[0]; // Element Parent
          const example_siblings = await bpmLabels[0]
            .asElement()
            .$x('following-sibling::*'); // Element Siblings
          const bpm = await parent_node;

          Logger.log('Page has been evaluated!');
          const val = await page.evaluate((el) => el.textContent, bpm);
          Logger.log('val', val);
          parsedBpm = val.replace('BPM', '');
          Logger.log('bpm', parsedBpm);

          await browser.close();
          resolve(parsedBpm);
        } catch (error) {
          await browser.close();
          Logger.error(error);
          reject('No BPM result for');
        }
      } catch (error) {
        Logger.error(error);
        reject('Puppeter not working =)');
      }
    });
  }
}
