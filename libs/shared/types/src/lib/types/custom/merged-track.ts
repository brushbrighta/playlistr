import { Video } from '../discogs/response';

export interface MergedTrack {
  id: number;
  discogsIndex: number;
  appleMusicTrackId: number;
  discogsreleaseId: number;
  imageName?: string;
  video: Video | null;
}
