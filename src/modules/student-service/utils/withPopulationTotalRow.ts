import type { PopulationData } from "../types";

type NumericKeys<T> = {
    [K in keyof T]: T[K] extends number ? K : never
}[keyof T];

const numericKeys: NumericKeys<PopulationData>[] = [
    "less_than_nineteen",
    "nineteen",
    "twenty",
    "twenty_one",
    "twenty_two",
    "twenty_three",
    "twenty_four",
    "twenty_five",
    "twenty_six",
    "twenty_seven",
    "twenty_eight",
    "twenty_nine",
    "thirty",
    "thirty_one",
    "greater_than_thirty_one",
    "total_female",
    "total_male",
    "student_count",
];

export const withPopulationTotalRow = (
    rows: PopulationData[]
): PopulationData[] => {
    if (!rows.length) return [];

    const initial: PopulationData = {
        id: 0,
        faculty_abreviation: "Total",
        departement_name: "Total",
        class_name: "Total",
        sexe: "-",
        less_than_nineteen: 0,
        nineteen: 0,
        twenty: 0,
        twenty_one: 0,
        twenty_two: 0,
        twenty_three: 0,
        twenty_four: 0,
        twenty_five: 0,
        twenty_six: 0,
        twenty_seven: 0,
        twenty_eight: 0,
        twenty_nine: 0,
        thirty: 0,
        thirty_one: 0,
        greater_than_thirty_one: 0,
        total_female: 0,
        total_male: 0,
        student_count: 0,
    };

    const totalRow = rows.reduce((acc, row) => {
        numericKeys.forEach(key => {
            acc[key] += row[key];
        });
        return acc;
    }, initial);

    return [...rows, totalRow];
};
