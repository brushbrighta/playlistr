import { Injectable, Logger } from '@nestjs/common';
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

import { Release } from '@playlistr/shared/types';
import { DataAccessService } from './data.access.service';

@Injectable()
export class RetrieveDiscogsCollectionService {
  userName = 'nikolaj_bremen';
  constructor(
    private httpService: HttpService,
    private dataAccessService: DataAccessService
  ) {}

  private getCollectionData(): Release[] | null {
    const collectionJsonRaw =
      this.dataAccessService.getCollectionReleasesJson();
    const collectionJson =
      collectionJsonRaw && collectionJsonRaw.length
        ? JSON.parse(collectionJsonRaw)
        : null;
    return collectionJson;
  }

  getCollection(): Observable<Release[]> {
    const collectionJson = this.getCollectionData();

    if (collectionJson && collectionJson.length) {
      return of(collectionJson);
    }

    const url =
      'https://api.discogs.com/users/' +
      this.userName +
      '/collection/folders/0/releases?per_page=500';

    const metaJsonRaw = this.dataAccessService.getMetaJson();
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
            tap(this.dataAccessService.writeMetaJson)
          );
    return meta$.pipe(
      switchMap((urls: { url: string }[]) => {
        // const jsonRaw = this.getMetaJson();

        const requests = urls.map((url, index) => {
          return timer(Math.floor(index / 10) * 60000).pipe(
            tap((_) => Logger.log('fetching ', url)),
            switchMap((_) =>
              this.httpService
                .get(url.url)
                .pipe(map((response) => response.data))
            )
          );
        });
        return combineLatest(requests).pipe(
          tap((res) => this.dataAccessService.writeCollectionReleasesJson(res))
        );
      })
    );
    // from http://nuxostyle.free.fr/rdm/
    //
    // Logger.log('get collection: at ' + url);
    // jQuery.getJSON(url, function(data) {
    //   $(".discogs-loading").hide();
    //   $(".blink_me").show();
    //   $(".header").show();
    //   if (data.pagination.items > 1) {
    //     page_id = Math.floor((Math.random() * data.pagination.pages) + 1);
    //     Logger.log("select random page : " + page_id + " / " + ((data.pagination.pages)));
    //     page_url = "https://api.discogs.com/users/" + username + "/collection/folders/0/releases?callback=&sort=added&sort_order=desc&page=" + page_id + "&per_page=1";
    //     jQuery.getJSON(page_url, function(datapage) {
    //       Logger.log("get page from collection at : " + page_url);
    //       label = "";
    //       if (typeof(datapage.releases[0].basic_information.labels) != 'undefined') {
    //         $.each(datapage.releases[0].basic_information.labels, function(cle, valeur) {
    //           label = label.concat(valeur.name + ' - ' + valeur.catno + ', ');
    //         })
    //         lastIndex = label.lastIndexOf(",");
    //         label = label.substring(0, lastIndex);
    //       }
    //       image = '<tr><td style="width:135px"><img border="1" class="discogs-link" data-href="http://www.discogs.com/release/' + datapage.releases[0].basic_information.id + '" height="125" width="125" src="' + datapage.releases[0].basic_information.cover_image + '"></td><td nowrap>' + datapage.releases[0].basic_information.artists[0].name + ' - ' + datapage.releases[0].basic_information.title + '<br><br>Label: ' + label + '<br>Format: ' + datapage.releases[0].basic_information.formats[0].name + ', ' + datapage.releases[0].basic_information.formats[0].descriptions[0] + ', ' + datapage.releases[0].basic_information.formats[0].descriptions[1] + '<br><span class="country"></span><br>Released: ' + datapage.releases[0].basic_information.year + '<br><span class="genre"></span><br><span class="style"></span></td></tr>';
    //       Logger.log('get release at ' + datapage.releases[0].basic_information.resource_url);
    //       release_url = datapage.releases[0].basic_information.resource_url;
    //       date_ajout = datapage.releases[0].date_added;
    //       added_since = moment(date_ajout, "YYYY-MM-DD").fromNow();
    //       Logger.log('release added to collection on ' + date_ajout);
    //       var logtext = datapage.releases[0].basic_information.labels[0].name + ' | ' + datapage.releases[0].basic_information.artists[0].name + ' | ' + datapage.releases[0].basic_information.title + ' | ' + datapage.releases[0].basic_information.formats[0].name + ' | ' + datapage.releases[0].basic_information.formats[0].descriptions[0] + ' | ' + datapage.releases[0].basic_information.formats[0].descriptions[1] + ' | ' + datapage.releases[0].basic_information.year;
    //       Logger.log(logtext);
    //       $(".date").text('playing item n°' + page_id + '/' + data.pagination.pages + ' added to collection ' + added_since);
    //       $("#test").val(logtext);
    //       jQuery.getJSON(release_url, function(tube) {
    //         tracklist = tube.tracklist;
    //         Logger.log('get tracklist :');
    //         track = "";
    //         //tracklist
    //         $.each(tracklist, function(cle, valeur) {
    //           if (typeof(valeur.artists) == 'undefined') {
    //             artist = "";
    //           } else {
    //             artist = valeur.artists[0].name;
    //           }
    //           Logger.log(valeur.position + '-' + valeur.title);
    //           track = track.concat('<tr><td>' + valeur.position + ' ' + artist + ' - ' + valeur.title + '</td></tr>');
    //         })
    //         $(track).appendTo("#track-collection");
    //         Logger.log("----------------COMPANIES-ETC----------------------");
    //         //companies, etc
    //         if (typeof(tube.companies) == 'undefined') {
    //           companies = "";
    //         } else {
    //           $.each(tube.companies, function(cle, valeur) {
    //             Logger.log(valeur.entity_type_name + ' - ' + valeur.name);
    //           })
    //         }
    //         Logger.log("----------------CREDITS----------------------------");
    //         //credits
    //         if (typeof(tube.extraartists) == 'undefined') {
    //           extrainfo = "";
    //         } else {
    //           $.each(tube.extraartists, function(cle, valeur) {
    //             Logger.log(valeur.role + '-' + valeur.name);
    //           })
    //         }
    //         Logger.log("------------------NOTES--------------------------");
    //         //notes
    //         if (typeof(tube.notes) != 'undefined') {
    //           Logger.log(tube.notes);
    //         } else {
    //           Logger.log("no notes");
    //         }
    //         Logger.log("------------------MARKET----------------------");
    //         //market
    //         market_info = "";
    //         if ((typeof(tube.num_for_sale) != 'undefined') && (typeof(tube.lowest_price) != 'undefined')) {
    //           if (tube.num_for_sale > 0) {
    //             market_info = tube.num_for_sale + ' for sale from ' + tube.lowest_price + ' €';
    //           }
    //         }
    //         Logger.log(market_info);
    //         Logger.log("--------------------------------------------");
    //         //if no video
    //         if (typeof(tube.videos) == 'undefined') {
    //           Logger.log("error no video found. reloading....");
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
    //         Logger.log('get video url: ' + link);
    //         var vi_id = getVidId(link);
    //         Logger.log('get video id: ' + vi_id);
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
    //         Logger.log('get video length: ' + refreshtime);
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
}
