import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { AppleMusicTrack } from '@playlistr/shared/types';

export const APPLE_MUSIC_FEATURE_KEY = 'appleMusic';

export interface State extends EntityState<AppleMusicTrack> {
  selectedId?: string | number; // which AppleMusicTrack record has been selected
  loaded: boolean; // has the AppleMusicTrack list been loaded
  error?: string | null; // last known error (if any),
  setFilters: string[];
  moodFilters: string[];
  genreFilters: string[];
}

export interface AppleMusicPartialState {
  readonly [APPLE_MUSIC_FEATURE_KEY]: State;
}

export const appleMusicTrackAdapter: EntityAdapter<AppleMusicTrack> =
  createEntityAdapter<AppleMusicTrack>({
    selectId: (data: AppleMusicTrack) => data['Track ID'],
  });
