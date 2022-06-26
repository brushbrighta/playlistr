import { Video } from '../response/video';

export interface MergedTrack {
  id: string; // discogsreleaseId + '_' + discogs_position
  discogsIndex: number;
  discogsreleaseId: number;
  video: Video | null;
}
