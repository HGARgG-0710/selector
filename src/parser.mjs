import { InputStream } from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"
import { SelectorTokenizer } from "./char/parser.mjs"
import { SimpleSelectorParser } from "./simple/parser.mjs"
import { CompoundSelectorParser } from "./compound/parser.mjs"
import { SelectorCombinatorParser } from "./combinator/parser.mjs"
import { SelectorStringParser } from "./string/parser.mjs"
import { SelectorListParser } from "./list/parser.mjs"
import { DeSpaceSelector } from "./despace/parser.mjs"

const { trivialCompose } = _f

export const SelectorParser = trivialCompose(
	...[
		SelectorCombinatorParser,
		DeSpaceSelector,
		CompoundSelectorParser,
		SimpleSelectorParser,
		SelectorListParser,
		SelectorStringParser,
		SelectorTokenizer
	]
		.map((x) => [x, InputStream])
		.flat()
)

export default SelectorParser
