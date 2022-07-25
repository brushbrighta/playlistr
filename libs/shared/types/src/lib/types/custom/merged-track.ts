import { Video } from '../discogs/response';

export interface MergedTrack {
  id: string;
  discogsIndex: number;
  appleMusicTrackId: number;
  discogsreleaseId: number;
  imageName?: string;
  video: Video | null;
}
