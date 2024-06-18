import { InputStream, StringPattern } from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"
import { SelectorTokenizer } from "./char/parser.mjs"
import { SimpleSelectorParser } from "./simple/parser.mjs"
import { CompoundSelectorParser } from "./compound/parser.mjs"
import { SelectorCombinatorParser } from "./combinator/parser.mjs"
import { SelectorStringParser } from "./string/parser.mjs"
import { SelectorListParser } from "./list/parser.mjs"
import { DeSpaceSelector } from "./despace/parser.mjs"

const { trivialCompose } = _f

const latterParser = trivialCompose(
	...[
		SelectorCombinatorParser,
		DeSpaceSelector,
		CompoundSelectorParser,
		SimpleSelectorParser
	]
		.map((x) => [x, InputStream])
		.flat()
)

// ! PROOOBLLLEEEEEMMMM! there ISN'T a handler for cases like ':has(...)'! [add it];
export const SelectorParser = trivialCompose(
	(x) => (x.length - 1 ? x.map(latterParser) : latterParser(x[0])),
	trivialCompose(
		...[SelectorListParser, SelectorStringParser].map((x) => [x, InputStream]).flat(),
		(x) => x.value.map((x) => ({ ...x, value: x.value.value })),
		SelectorTokenizer,
		StringPattern
	)
)

export default SelectorParser
