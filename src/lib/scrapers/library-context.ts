/**
 * Per-request credentials for Meta / TikTok (user OAuth or server env).
 */

export type LibraryFetchContext = {
  meta_access_token?: string | null;
  tiktok?: {
    user_access_token?: string | null;
    client_key?: string | null;
    client_secret?: string | null;
  };
};
