export type AltKeyOptions = {
  deep?: boolean;
  defaultValue?: any;
  valueTransform?: (value: any) => any;
};

export type AtlKeyCondition = (value: any) => boolean;

export default class Transformer<T = any> {
  public readonly result: T = this.obj;

  constructor(private readonly obj: T) {}

  /* Merge nested keys into one key (works when param `deep` = true)
  |  Ex: brand : { name : "Test" } => { brandName : "Test" }
  |  Ex: brand : { data: { name:"Test" }} => { brandDataName : "Test" }
  */
  private flattenKeysWithValues = (obj: any, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const nestedKey = prefix
        ? `${prefix}${key.charAt(0).toUpperCase() + key.slice(1)}`
        : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(acc, this.flattenKeysWithValues(obj[key], nestedKey));
      } else {
        acc[nestedKey] = obj[key];
      }
      return acc;
    }, {});
  };

  altKey(
    prop: keyof T,
    regex: RegExp,
    condition: AtlKeyCondition,
    options?: AltKeyOptions,
  ) {
    const { deep, defaultValue, valueTransform = (v) => v } = options;

    const obj = deep ? this.flattenKeysWithValues(this.obj) : this.obj;
    const keys = Object.keys(obj);

    const possibleKeys = keys.filter((key) => regex.test(key));

    if (!possibleKeys.length) {
      this.result[prop] = defaultValue ?? this.obj[prop];
      return this.result;
    }

    let matched = false;
    possibleKeys.every((key) => {
      const value = obj[key];
      if (!condition(value)) return true;
      this.result[prop] = valueTransform(value);
      matched = true;
      return false;
    });

    if (!matched) this.result[prop] = defaultValue ?? this.obj[prop];

    return this.result;
  }

  cleanObject(keysToKeep: string[]) {
    const keys = Object.keys(this.result);
    keys.forEach((key) => {
      if (!keysToKeep.includes(key)) delete this.result[key];
    });
  }
}
