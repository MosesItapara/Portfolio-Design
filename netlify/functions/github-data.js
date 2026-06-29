const GITHUB_USER = 'MosesItapara';

let cache = null;
let cacheTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000;

exports.handler = async () => {
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL_MS) {
    return respond(cache);
  }

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`, {
      headers: { 'User-Agent': 'portfolio-site' }
    });

    if (!res.ok) {
      return cache ? respond(cache) : { statusCode: res.status, body: JSON.stringify({ error: 'GitHub API error' }) };
    }

    const repos = await res.json();
    const owned = repos.filter(r => !r.fork);

    const languageCounts = {};
    const repoMap = {};
    owned.forEach(r => {
      if (r.language) languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
      repoMap[r.name] = {
        stars: r.stargazers_count,
        updatedAt: r.pushed_at,
        language: r.language
      };
    });

    const topLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([lang]) => lang);

    const data = {
      repoCount: owned.length,
      topLanguages,
      repos: repoMap
    };

    cache = data;
    cacheTime = now;
    return respond(data);

  } catch (err) {
    if (cache) return respond(cache);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to reach GitHub: ' + err.message }) };
  }
};

function respond(data) {
  return {
    statusCode: 200,
    headers: { 'Cache-Control': 'public, max-age=600' },
    body: JSON.stringify(data)
  };
}
