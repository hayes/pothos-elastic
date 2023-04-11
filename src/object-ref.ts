import { abstractReturnShapeKey, brandWithType, ObjectRef, typeBrandKey } from '@pothos/core';


export type WithBrand<T> = T & { [typeBrandKey]: string };

// Copied from the Prisma Plugin. I'm not entirely sure what this does. Right now we are using
// it as the return type of the elasticsearch builder.
export class ElasticsearchObjectRef< T = {}> extends ObjectRef<T> {
    [abstractReturnShapeKey]!: WithBrand<T>;

    constructor(name: string ) {
        super(name);

    }

    addBrand<V extends T | T[]>(
        value: V,
    ): V extends T[] ? { [K in keyof V]: WithBrand<V[K]> } : WithBrand<V> {
        if (Array.isArray(value)) {
            value.forEach((val) => void brandWithType(val, this.name as never));

            return value as never;
        }

        brandWithType(value, this.name as never);

        return value as never;
    }

    hasBrand(value: unknown) {
        return (
            typeof value === 'object' &&
            value !== null &&
            typeBrandKey in value &&
            (value as { [typeBrandKey]?: unknown })[typeBrandKey] === this.name
        );
    }
}
