import { InputStream, StringPattern } from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"
import { SelectorTokenizer } from "./char/parser.mjs"
import { SelectorStringParser } from "./string/parser.mjs"
import { EscapeParser } from "./escaped/parser.mjs"
import { EndParser } from "./bracket/parser.mjs"

const { trivialCompose } = _f

// ! problem [1]: with 'simple' parser and (as consequence), __everything__ related to names on that level (same as before: NEED TO PARSE IDENTIFIERS INSTEAD OF STRINGS...);
export const SelectorParser = trivialCompose(
	(x) => (x.length === 1 ? x[0] : x),
	...[EndParser, SelectorStringParser, EscapeParser]
		.map((x) => [x, InputStream])
		.flat(),
	(x) => x.value.map((x) => ({ ...x, value: x.value.value })),
	SelectorTokenizer,
	StringPattern
)

export default SelectorParser
