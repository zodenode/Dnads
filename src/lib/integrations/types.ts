export type UserIntegrations = {
  /** Long-lived Meta user access token with ads_read (or system token) */
  meta_access_token_enc?: string;
  /** TikTok user OAuth access_token (research scopes when granted) */
  tiktok_access_token_enc?: string;
  tiktok_refresh_token_enc?: string;
  /** Optional: per-user TikTok app for OAuth (otherwise server env) */
  tiktok_client_key_enc?: string;
  tiktok_client_secret_enc?: string;
  updated_at: string;
};
