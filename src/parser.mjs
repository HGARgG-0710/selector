import { InputStream, StringPattern } from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"
import { SelectorTokenizer } from "./char/parser.mjs"
import { SelectorStringParser } from "./string/parser.mjs"
import { EscapeParser } from "./escaped/parser.mjs"
import { EndParser } from "./bracket/parser.mjs"

const { trivialCompose } = _f

export const SelectorParser = trivialCompose(
	...[EndParser, SelectorStringParser, EscapeParser]
		.map((x) => [x, InputStream])
		.flat(),
	(x) => x.value.map((x) => ({ ...x, value: x.value.value })),
	SelectorTokenizer,
	StringPattern
)

export default SelectorParser
