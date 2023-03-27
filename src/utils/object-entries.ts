export type ValueOf<T> = T extends unknown ? T[keyof T] : never;

export type Prettify<T> = {
  [K in keyof T]: T[K];
};

export type AnyObject<T> = Partial<Record<keyof T, ValueOf<T>>>;
export type ObjectKeys<T> = (keyof T)[];
export type ObjectValues<T> = ValueOf<T>[];
export type ObjectEntries<T> = [keyof T, ValueOf<T>][];

export const objectKeys = <T extends AnyObject<T>>(
  object: T,
): Prettify<ObjectKeys<T>> => (<ObjectKeys<T>>Object.keys(object));

export const objectValues = <T extends AnyObject<T>>(
  object: T,
): Prettify<ObjectValues<T>> => (<ObjectValues<T>>Object.values(object));

export const objectEntries = <T extends AnyObject<T>>(
  object: T,
): Prettify<ObjectEntries<T>> => (<ObjectEntries<T>>Object.entries(object));

export const object = Object.freeze({
  keys: objectKeys,
  values: objectValues,
  entries: objectEntries,
});
