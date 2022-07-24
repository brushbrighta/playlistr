export interface AppleMusicTrack {
  'Track ID': number;
  Name: string;
  Artist: string;
  'Album Artist': string;
  Composer: string;
  Album: string;
  Grouping: string;
  Genre: string;
  Kind: string; // "Apple Music AAC-Audiodatei", todo: maybe ENUM
  Size: number;
  'Total Time': number;
  'Disc Number': number;
  'Disc Count': number;
  'Track Number': number;
  'Track Count': number;
  Year: number; // 1972
  'Date Modified': string; // "2022-06-03T04:12:21.000Z",
  'Date Added': string; // "2022-06-03T04:12:21.000Z",
  'Bit Rate': number; // 256,
  'Sample Rate': number; // 44100,
  Comments: string; // "SET1 / SET2 / MOOD4",
  'Play Count': number;
  'Play Date': number; // 3738683046,
  'Play Date UTC': string; // "2022-06-21T17:04:06.000Z",
  'Release Date': string; //"1972-03-03T12:00:00.000Z",
  Loved?: string; //"" => means true, otherwise it´s undefined
  'Artwork Count': number;
  'Sort Album': string;
  'Sort Artist': string;
  'Sort Name': string;
  'Persistent ID': string; //"AEFD9A9E37909B9E",
  'Track Type': string; // "Remote", todo: maybe enum
  'Apple Music'?: string; // "" => means true, otherwise it´s undefined
  'Location'?: string
}
