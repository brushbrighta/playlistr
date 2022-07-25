import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Release } from '@playlistr/shared/types';

export const DISCOGS_RELEASE_FEATURE_KEY = 'discogsRelease';

export interface State extends EntityState<Release> {
  selectedId?: string | number; // which DiscogsRelease record has been selected
  loaded: boolean; // has the DiscogsRelease list been loaded
  error?: string | null; // last known error (if any)
}

export interface DiscogsReleasePartialState {
  readonly [DISCOGS_RELEASE_FEATURE_KEY]: State;
}

export const discogsReleaseAdapter: EntityAdapter<Release> =
  createEntityAdapter<Release>();
