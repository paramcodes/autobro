import { adjectives, animals, uniqueNamesGenerator } from "unique-names-generator";

export function generateSlug(): string {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "-",
    style: "lowerCase",
  });
}
