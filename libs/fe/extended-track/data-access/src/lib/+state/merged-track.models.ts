import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { MergedTrack } from '@playlistr/shared/types';

export const MERGED_TRACK_FEATURE_KEY = 'mergedTrack';

export interface State extends EntityState<MergedTrack> {
  selectedId?: string | number; // which MergedTrack record has been selected
  loaded: boolean; // has the MergedTrack list been loaded
  error?: string | null; // last known error (if any)
}

export interface MergedTrackPartialState {
  readonly [MERGED_TRACK_FEATURE_KEY]: State;
}

export const MergedTrackAdapter: EntityAdapter<MergedTrack> =
  createEntityAdapter<MergedTrack>({
    selectId: (data: MergedTrack) => data['id'],
  });
