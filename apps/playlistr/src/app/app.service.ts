import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
  tap,
  timer,
} from 'rxjs';

import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { Release } from '@playlistr/shared/types';
import * as fs from 'fs';
const puppeteer = require('puppeteer');
const axios = require('axios');

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
export class AppService {
  userName = 'nikolaj_bremen';
  constructor(private httpService: HttpService) {}

  private getMetaJson() {
    return readFileSync(
      join(process.cwd(), 'data', 'collection-meta.json'),
      'utf8'
    );
  }
  private getCollectionJson() {
    return readFileSync(
      join(process.cwd(), 'data', 'collection-releases.json'),
      'utf8'
    );
  }
  private writeCollectionJson(data) {
    writeFileSync(
      join(process.cwd(), 'data', 'collection-releases.json'),
      JSON.stringify(data, null, 4)
    );
  }
  private writeMetaJson(data) {
    writeFileSync(
      join(process.cwd(), 'data', 'collection-meta.json'),
      JSON.stringify(data, null, 4)
    );
  }

  getCollection(): Observable<Release[]> {
    const collectionJsonRaw = this.getCollectionJson();
    const collectionJson =
      collectionJsonRaw && collectionJsonRaw.length
        ? JSON.parse(collectionJsonRaw)
        : '';

    if (collectionJson && collectionJson.length) {
      return of(collectionJson);
    }

    const url =
      'https://api.discogs.com/users/' +
      this.userName +
      '/collection/folders/0/releases?per_page=500';

    const metaJsonRaw = this.getMetaJson();
    const metaJson =
      metaJsonRaw && metaJsonRaw.length ? JSON.parse(metaJsonRaw) : '';

    const meta$ =
      metaJson && metaJson.length
        ? of(metaJson)
        : this.httpService.get(url).pipe(
            map((response) =>
              response.data.releases.map((s) => ({
                url: s.basic_information.resource_url,
              }))
            ),
            tap(this.writeMetaJson)
          );
    return meta$.pipe(
      switchMap((urls: { url: string }[]) => {
        // const jsonRaw = this.getMetaJson();

        const requests = urls.map((url, index) => {
          return timer(Math.floor(index / 10) * 60000).pipe(
            tap((_) => console.log('fetching ', url)),
            switchMap((_) =>
              this.httpService
                .get(url.url)
                .pipe(map((response) => response.data))
            )
          );
        });
        return combineLatest(requests).pipe(
          tap((res) => this.writeCollectionJson(res))
        );
      })
    );
    // from http://nuxostyle.free.fr/rdm/
    //
    // console.log('get collection: at ' + url);
    // jQuery.getJSON(url, function(data) {
    //   $(".discogs-loading").hide();
    //   $(".blink_me").show();
    //   $(".header").show();
    //   if (data.pagination.items > 1) {
    //     page_id = Math.floor((Math.random() * data.pagination.pages) + 1);
    //     console.log("select random page : " + page_id + " / " + ((data.pagination.pages)));
    //     page_url = "https://api.discogs.com/users/" + username + "/collection/folders/0/releases?callback=&sort=added&sort_order=desc&page=" + page_id + "&per_page=1";
    //     jQuery.getJSON(page_url, function(datapage) {
    //       console.log("get page from collection at : " + page_url);
    //       label = "";
    //       if (typeof(datapage.releases[0].basic_information.labels) != 'undefined') {
    //         $.each(datapage.releases[0].basic_information.labels, function(cle, valeur) {
    //           label = label.concat(valeur.name + ' - ' + valeur.catno + ', ');
    //         })
    //         lastIndex = label.lastIndexOf(",");
    //         label = label.substring(0, lastIndex);
    //       }
    //       image = '<tr><td style="width:135px"><img border="1" class="discogs-link" data-href="http://www.discogs.com/release/' + datapage.releases[0].basic_information.id + '" height="125" width="125" src="' + datapage.releases[0].basic_information.cover_image + '"></td><td nowrap>' + datapage.releases[0].basic_information.artists[0].name + ' - ' + datapage.releases[0].basic_information.title + '<br><br>Label: ' + label + '<br>Format: ' + datapage.releases[0].basic_information.formats[0].name + ', ' + datapage.releases[0].basic_information.formats[0].descriptions[0] + ', ' + datapage.releases[0].basic_information.formats[0].descriptions[1] + '<br><span class="country"></span><br>Released: ' + datapage.releases[0].basic_information.year + '<br><span class="genre"></span><br><span class="style"></span></td></tr>';
    //       console.log('get release at ' + datapage.releases[0].basic_information.resource_url);
    //       release_url = datapage.releases[0].basic_information.resource_url;
    //       date_ajout = datapage.releases[0].date_added;
    //       added_since = moment(date_ajout, "YYYY-MM-DD").fromNow();
    //       console.log('release added to collection on ' + date_ajout);
    //       var logtext = datapage.releases[0].basic_information.labels[0].name + ' | ' + datapage.releases[0].basic_information.artists[0].name + ' | ' + datapage.releases[0].basic_information.title + ' | ' + datapage.releases[0].basic_information.formats[0].name + ' | ' + datapage.releases[0].basic_information.formats[0].descriptions[0] + ' | ' + datapage.releases[0].basic_information.formats[0].descriptions[1] + ' | ' + datapage.releases[0].basic_information.year;
    //       console.log(logtext);
    //       $(".date").text('playing item n°' + page_id + '/' + data.pagination.pages + ' added to collection ' + added_since);
    //       $("#test").val(logtext);
    //       jQuery.getJSON(release_url, function(tube) {
    //         tracklist = tube.tracklist;
    //         console.log('get tracklist :');
    //         track = "";
    //         //tracklist
    //         $.each(tracklist, function(cle, valeur) {
    //           if (typeof(valeur.artists) == 'undefined') {
    //             artist = "";
    //           } else {
    //             artist = valeur.artists[0].name;
    //           }
    //           console.log(valeur.position + '-' + valeur.title);
    //           track = track.concat('<tr><td>' + valeur.position + ' ' + artist + ' - ' + valeur.title + '</td></tr>');
    //         })
    //         $(track).appendTo("#track-collection");
    //         console.log("----------------COMPANIES-ETC----------------------");
    //         //companies, etc
    //         if (typeof(tube.companies) == 'undefined') {
    //           companies = "";
    //         } else {
    //           $.each(tube.companies, function(cle, valeur) {
    //             console.log(valeur.entity_type_name + ' - ' + valeur.name);
    //           })
    //         }
    //         console.log("----------------CREDITS----------------------------");
    //         //credits
    //         if (typeof(tube.extraartists) == 'undefined') {
    //           extrainfo = "";
    //         } else {
    //           $.each(tube.extraartists, function(cle, valeur) {
    //             console.log(valeur.role + '-' + valeur.name);
    //           })
    //         }
    //         console.log("------------------NOTES--------------------------");
    //         //notes
    //         if (typeof(tube.notes) != 'undefined') {
    //           console.log(tube.notes);
    //         } else {
    //           console.log("no notes");
    //         }
    //         console.log("------------------MARKET----------------------");
    //         //market
    //         market_info = "";
    //         if ((typeof(tube.num_for_sale) != 'undefined') && (typeof(tube.lowest_price) != 'undefined')) {
    //           if (tube.num_for_sale > 0) {
    //             market_info = tube.num_for_sale + ' for sale from ' + tube.lowest_price + ' €';
    //           }
    //         }
    //         console.log(market_info);
    //         console.log("--------------------------------------------");
    //         //if no video
    //         if (typeof(tube.videos) == 'undefined') {
    //           console.log("error no video found. reloading....");
    //           $(".date").text(" sorry no video found, page will refresh quickly...");
    //           $(".discogs-link").css("-webkit-animation", "none");
    //           $(".discogs-link").css("-moz-animation", "none");
    //           $(".discogs-link").css("animation", "none");
    //           setTimeout(function() {
    //             window.location.reload(1);
    //           }, 3500);
    //         }
    //         link = YouTubeUrlNormalize(tube.videos[0].uri);
    //         videoframe = '<iframe type="text/html" id="yt" width="125" height="75" src="' + link + '?autoplay=1&enablejsapi=1"></iframe>';
    //         $(videoframe).appendTo("#videotube");
    //         console.log('get video url: ' + link);
    //         var vi_id = getVidId(link);
    //         console.log('get video id: ' + vi_id);
    //         //display info country, genre, style
    //         $(".country").text('Country: ' + tube.country);
    //         if (typeof(tube.genres) != 'undefined') {
    //           genres = "";
    //           $.each(tube.genres, function(cle, valeur) {
    //             genres = genres.concat(valeur + ', ');
    //           })
    //           lastIndex = genres.lastIndexOf(",");
    //           genres = genres.substring(0, lastIndex);
    //           $(".genre").text('Genre: ' + genres);
    //         }
    //         if (typeof(tube.styles) != 'undefined') {
    //           styles = "";
    //           $.each(tube.styles, function(cle, valeur) {
    //             styles = styles.concat(valeur + ', ');
    //           })
    //           lastIndex = styles.lastIndexOf(",");
    //           styles = styles.substring(0, lastIndex);
    //           $(".style").text('Style: ' + styles);
    //         }
    //         //refresh at end of video length
    //         var refreshtime = (tube.videos[0].duration) * 1000;
    //         console.log('get video length: ' + refreshtime);
    //         setTimeout(function() {
    //           window.location.reload(1);
    //         }, refreshtime);
    //       })
    //       $(image).appendTo("#discogs-collection");
    //       $(".discogs-link").click(function() {
    //         window.open($(this).data("href"));
    //       });
    //     })
    //   } else {
    //     $("#discogs-collection").append("<tr class='discogs-error'><td>Error! Something is up with the Discogs API.</td></tr>");
    //   }
    // });
  }

  async addImage(id: string) {
    const _id: number = parseInt(id, 10);
    const collectionJsonRaw = this.getCollectionJson();
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
      console.log('page has been loaded!');

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
      console.log('Page has been evaluated!');

      // Persist data into data.json file
      // fs.writeFileSync('./data.json', JSON.stringify(issueSrcs));
      console.log('File is created!');

      // End Puppeteer

      await browser.close();

      try {
        downloadImage(
          issueSrcs[0],
          join(process.cwd(), 'data/images', `${id}.png`)
        );
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }

    return null;
  }
}
