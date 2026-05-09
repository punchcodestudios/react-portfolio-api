const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

/**
 * Parses pagination params from an Express query object.
 * Enforces defaults and the maximum page size.
 *
 * @param {object} query - req.query
 * @returns {{ page: number, limit: number, skip: number }}
 */
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(query.limit, 10) || DEFAULT_LIMIT),
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Builds the pagination metadata block for req.meta.
 *
 * @param {{ page: number, limit: number, totalCount: number }} params
 * @returns {{ page: number, limit: number, totalCount: number, totalPages: number }}
 */
const buildPaginationMeta = ({ page, limit, totalCount }) => ({
  page,
  limit,
  totalCount,
  totalPages: Math.ceil(totalCount / limit),
});

module.exports = { parsePagination, buildPaginationMeta };
