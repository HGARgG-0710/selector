import { InputStream, StringPattern } from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"
import { SelectorTokenizer } from "./char/parser.mjs"
import { SelectorStringParser } from "./string/parser.mjs"
import { EscapeParser } from "./escaped/parser.mjs"
import { EndParser } from "./bracket/parser.mjs"

const { trivialCompose } = _f

// ! PROBLEM: ESCAPED CHARACTERS ARE NOT ALLOWED AS PARTS OF STRINGS/IDENTIFIERS! [the 'Escaped' token...];
// * They can be [spec-defined]:
// % 	1. Portions of strings;
// % 	2. Parts of Identifiers;
// ^ CONCLUCION [1]: the current 'SelectorSymbol' HAS TO BE RE-CONSIDERED! [Make into an 'or'-predicate of `SelectorSymbol` and `Escaped`...]; AND THE DEFINITION USED FOR STRINGS/IDENTIFIERS to be generalized (expanded), and refactored...;
export const SelectorParser = trivialCompose(
	...[EndParser, SelectorStringParser, EscapeParser]
		.map((x) => [x, InputStream])
		.flat(),
	(x) => x.value.map((x) => ({ ...x, value: x.value.value })),
	SelectorTokenizer,
	StringPattern
)

export default SelectorParser
