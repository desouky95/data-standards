import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import parseTimeString, { TimeString } from "./parseTimeString";
import { dirname, join, resolve } from "path";
import { result } from "lodash";

type CacheEntry<T> = {
  result: T;
  expiresAt: number;
};
interface CacheData {
  [key: string]: CacheEntry<any>;
}

type CacheFn<T> = (...args: any[]) => T;
type AwaitedFn<T> = (...args: any[]) => Promise<T>;

type ReturnCache<T> = ReturnType<CacheFn<T>> | ReturnType<AwaitedFn<T>>;

/**
 * PersistCache is cache storage manager
 * it's cache value and function results
 */
export class PersistCache {
  private cache: CacheData;
  private cacheDir = join(process.cwd(), ".cache");
  private cachePath = join(this.cacheDir, "cachedFuncs.json");
  /**
   * inits new cache if not exists in './cache/cachedFuncs.json'
   * @constructor
   */
  constructor() {
    this.cache = this.openCache();
  }

  /**
   * @protected
   * @returns @see {@link CacheData | CachedData}
   */
  protected openCache(): CacheData {
    try {
      if (!existsSync(this.cacheDir)) mkdirSync(this.cacheDir);
      if (!existsSync(this.cachePath))
        writeFileSync(this.cachePath, JSON.stringify({}));
      // mkdirSync(this.cachePath, { recursive: true, mode: })
      const cache = readFileSync(this.cachePath, "utf8");
      return JSON.parse(cache);
    } catch (error) {
      return {};
    }
  }
  /**
   * saves current cache
   */
  protected save() {
    const data = JSON.stringify(this.cache, null, 4);
    writeFileSync(this.cachePath, data, "utf8");
  }
  /**
   * get cached data
   */
  get<T>(key: string): T | undefined {
    return this.cache[key].result;
  }

  /** set data into cache */
  set<T>(key: string, value: T): void {
    this.cache[key] = value as any;
    this.save();
  }
  /** deletes key from cache */
  remove(key: string) {
    delete this.cache[key];
    this.save();
  }

  clear() {
    this.cache = {};
    this.save();
  }

  /**
   * Caches function result for a specific time
   */

  private callFunctionAsync<T>(
    func: (...args: any[]) => Promise<T>,
    ...args: any[]
  ) {
    return Promise.resolve(func(...args));
  }
  cacheFn<T>(
    func: CacheFn<T> | AwaitedFn<T>,
    key?: string,
    timestamp: TimeString = "1 Day",
    ...args: any[]
  ): T | Promise<T> {
    const cacheKey = `${key ?? func.name}${args.length > 0 ? "_" : ""}${
      args.length > 0 ? JSON.stringify(args) : ""
    }`;
    const cached = this.cache[cacheKey] as CacheEntry<T>;

    const getFromCache = parseTimeString(timestamp) + Date.now() > Date.now();
    if (cached !== undefined && getFromCache) return this.get<T>(cacheKey);
    const result = func(...args);
    return new Promise(async (resolve, reject) => {
      Promise.resolve(result).then((result) => {
        const expiresAt = Date.now() + parseTimeString(timestamp);
        this.set(cacheKey, { result, expiresAt });
        resolve(result);
      });
    });
    // if (result instanceof Promise) {

    // } else {

    //     const expiresAt = Date.now() + parseTimeString(timestamp)
    //     this.set(cacheKey, { result, expiresAt })
    //     return result as T
    // }
  }
}
