// * Part of the API that corresponds to parsers and parsing.

import { InputStream, StringPattern } from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"
import { SelectorTokenizer } from "./char/parser.mjs"
import { SelectorStringParser } from "./string/parser.mjs"
import { EscapeParser } from "./escaped/parser.mjs"
import { EndParser } from "./bracket/parser.mjs"

const { trivialCompose } = _f

export * from "./bracket/parser.mjs"
export * from "./char/parser.mjs"
export * from "./combinator/parser.mjs"
export * from "./compound/parser.mjs"
export * from "./despace/parser.mjs"
export * from "./escaped/parser.mjs"
export * from "./list/parser.mjs"
export * from "./simple/parser.mjs"
export * from "./simple/attribute/parser.mjs"
export * from "./simple/identifier/parser.mjs"
export * from "./string/parser.mjs"

// todo: EXPORT FROM ALL THE PARSERS PRESENT WITHIN THE LIBRARY!

export const SelectorParser = trivialCompose(
	...[EndParser, SelectorStringParser, EscapeParser]
		.map((x) => [x, InputStream])
		.flat(),
	(x) => x.value.map((x) => ({ ...x, value: x.value.value })),
	SelectorTokenizer,
	StringPattern
)

export default SelectorParser
