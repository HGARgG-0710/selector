// % Parser structure:
// 1. 1-level Tokenization - 'char',
// 2. 2-level parsing - 'simple' (this breaks things down into separate simple selector types);
// 3. 3-level parsing - 'compound'
// 4. 4-level parsing - 'combinators' (this defines combinators and their precedence/levels);
// 5. 5-level parsing - 'list's (the 'Comma' token)

import { InputStream } from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"
import { SelectorTokenizer } from "./char/parser.mjs"
import { SimpleSelectorParser } from "./simple/parser.mjs"
import { CompoundSelectorParser } from "./compound/parser.mjs"
import { SelectorCombinatorParser } from "./combinator/parser.mjs"

const { trivialCompose } = _f

// ! PROOBLEEM[1]: the 'list' must be placed AT THE BEGINNING! [not the end!]
// ^ BUT - if it's at the beginning, then the 'string's must be parsed BEFORE everything else!
// % Conclusion: 2 more parsing layers, first - strings, then - separate onto a LIST of selectors, then PARSE EACH INDIVIDUALLY!
// ! PROBLEMEEE[2]: the 'Space' combinator CAN re-appear several times.
// % CONCLUSION: RIGHT AFTER the 'compound', one must ALSO __Delete all the 'Space's that come before ANOTHER 'Combinator' and a Compound, between two Combinators-s and a Compound with Combinator [so that they can ONLY connect two compounds]__
export const SelectorParser = trivialCompose(
	SelectorCombinatorParser,
	InputStream,
	CompoundSelectorParser,
	InputStream,
	SimpleSelectorParser,
	InputStream,
	SelectorTokenizer,
	InputStream
)

export default SelectorParser
