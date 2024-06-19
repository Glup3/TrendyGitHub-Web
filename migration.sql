CREATE INDEX IF NOT EXISTS idx_mv_daily_stars_repository_id ON mv_daily_stars(repository_id);
CREATE INDEX IF NOT EXISTS idx_mv_daily_stars_stars_difference ON mv_daily_stars(stars_difference DESC);

CREATE INDEX IF NOT EXISTS idx_mv_weekly_stars_repository_id ON mv_weekly_stars(repository_id);
CREATE INDEX IF NOT EXISTS idx_mv_weekly_stars_stars_difference ON mv_weekly_stars(stars_difference DESC);

CREATE INDEX IF NOT EXISTS idx_mv_monthly_stars_repository_id ON mv_monthly_stars(repository_id);
CREATE INDEX IF NOT EXISTS idx_mv_monthly_stars_stars_difference ON mv_monthly_stars(stars_difference DESC);

DROP INDEX IF EXISTS idx_mv_daily_stars_repository_id;
DROP INDEX IF EXISTS idx_mv_daily_stars_stars_difference;
DROP INDEX IF EXISTS idx_mv_weekly_stars_repository_id;
DROP INDEX IF EXISTS idx_mv_weekly_stars_stars_difference;
DROP INDEX IF EXISTS idx_mv_monthly_stars_repository_id;
DROP INDEX IF EXISTS idx_mv_monthly_stars_stars_difference;
