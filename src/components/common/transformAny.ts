/* eslint-disable @typescript-eslint/no-explicit-any */
// Contraindre T pour simplifier l'indexation
type AnyObject = Record<string, any>;

type Rule<T extends AnyObject, V> = keyof T | ((item: T) => V);
export type TransformRules<T extends AnyObject, R> = {
    [K in keyof R]: Rule<T, R[K]>;
};

export function transformOne<T extends AnyObject, R>(
    item: T,
    rules: TransformRules<T, R>
): R {
    const result = {} as R;

    // on itère sur les clés de rules (string)
    for (const k of Object.keys(rules) as Array<keyof R>) {
        const rule = rules[k];

        if (typeof rule === "function") {
            // on dit explicitement à TS que rule est une fonction qui retourne R[k]
            const fn = rule as (i: T) => R[typeof k];
            result[k] = fn(item);
        } else {
            // ici rule est une clé de T — on cast pour rassurer TS
            const sourceKey = rule as keyof T;
            result[k] = item[sourceKey] as unknown as R[typeof k];
        }
    }

    return result;
}

export function transform<T extends AnyObject, R>(
    input: T | T[],
    rules: TransformRules<T, R>
): R | R[] {
    if (Array.isArray(input)) {
        return input.map((it) => transformOne(it, rules));
    }
    return transformOne(input, rules);
}
