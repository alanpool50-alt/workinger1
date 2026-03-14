import { base44 } from '@/api/base44Client';

/**
 * Search Service
 * 
 * Production-ready search with caching, ranking, and geospatial filtering.
 * In production, integrate with Meilisearch/Typesense/Elasticsearch.
 */

class SearchService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async searchJobs(params = {}) {
    const {
      query = '',
      location = null,
      radius = 50,
      job_type = null,
      experience_level = null,
      is_remote = null,
      salary_min = null,
      limit = 50,
    } = params;

    const cacheKey = JSON.stringify(params);
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    let jobs = await base44.entities.Job.filter({ status: 'active' }, '-created_date', 200);

    if (query) {
      jobs = this.rankByRelevance(jobs, query);
    }

    if (location?.latitude && location?.longitude) {
      jobs = jobs.map(job => ({
        ...job,
        _distance: this.calculateDistance(
          location.latitude,
          location.longitude,
          job.latitude,
          job.longitude
        ),
      }));

      if (!is_remote) {
        jobs = jobs.filter(job => job._distance <= radius || job.is_remote);
      }
    }

    if (job_type) jobs = jobs.filter(j => j.job_type === job_type);
    if (experience_level) jobs = jobs.filter(j => j.experience_level === experience_level);
    if (is_remote !== null) jobs = jobs.filter(j => j.is_remote === is_remote);
    if (salary_min) jobs = jobs.filter(j => (j.salary_max || 0) >= salary_min);

    jobs.sort((a, b) => {
      if (a._distance !== undefined && b._distance !== undefined) {
        return a._distance - b._distance;
      }
      return new Date(b.created_date) - new Date(a.created_date);
    });

    const result = jobs.slice(0, limit);

    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return result;
  }

  rankByRelevance(jobs, query) {
    const q = query.toLowerCase();
    return jobs
      .map(job => {
        let score = 0;
        const title = (job.title || '').toLowerCase();
        const company = (job.company || '').toLowerCase();
        const desc = (job.description || '').toLowerCase();
        const skills = (job.skills || []).join(' ').toLowerCase();

        if (title.includes(q)) score += 10;
        if (title.startsWith(q)) score += 5;
        if (company.includes(q)) score += 5;
        if (skills.includes(q)) score += 8;
        if (desc.includes(q)) score += 2;

        return { ...job, _relevance: score };
      })
      .filter(job => job._relevance > 0)
      .sort((a, b) => b._relevance - a._relevance);
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  async searchCities(query, limit = 10) {
    if (!query || query.length < 2) return [];
    
    const cacheKey = `cities_${query}_${limit}`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    const cities = await base44.entities.City.list('-population', 100);
    const q = query.toLowerCase();
    
    const results = cities
      .filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.region?.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const aStart = a.name.toLowerCase().startsWith(q) ? 0 : 1;
        const bStart = b.name.toLowerCase().startsWith(q) ? 0 : 1;
        if (aStart !== bStart) return aStart - bStart;
        return (b.population || 0) - (a.population || 0);
      })
      .slice(0, limit);

    this.cache.set(cacheKey, {
      data: results,
      timestamp: Date.now(),
    });

    return results;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const searchService = new SearchService();
export default searchService;
