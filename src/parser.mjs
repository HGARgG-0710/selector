// * Part of the API that corresponds to parsers and parsing.

import { InputStream, StringPattern } from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"
import { SelectorTokenizer } from "./char/parser.mjs"
import { SelectorStringParser } from "./string/parser.mjs"
import { EscapeParser } from "./escaped/parser.mjs"
import { EndParser } from "./bracket/parser.mjs"

const { trivialCompose } = _f

export * as char from "./char/parser.mjs"
export * as escaped from "./escaped/parser.mjs"
export * as string from "./string/parser.mjs"
export * as bracket from "./bracket/parser.mjs"
export * as list from "./list/parser.mjs"
export * as simple from "./simple/parser.mjs"
export * as attribute from "./simple/attribute/parser.mjs"
export * as identifier from "./simple/identifier/parser.mjs"
export * as compound from "./compound/parser.mjs"
export * as despace from "./despace/parser.mjs"
export * as combinator from "./combinator/parser.mjs"

export const SelectorParser = trivialCompose(
	...[EndParser, SelectorStringParser, EscapeParser]
		.map((x) => [x, InputStream])
		.flat(),
	(x) => x.value.map((x) => ({ ...x, value: x.value.value })),
	SelectorTokenizer,
	StringPattern
)

export default SelectorParser
