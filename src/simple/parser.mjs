import {
	PredicateMap,
	TokenSource,
	read,
	limit,
	InputStream,
	skip,
	BasicParser,
	is,
	current,
	next,
	output,
	forward,
	wrapped
} from "@hgargg-0710/parsers.js"

import {
	ParentSelector,
	PseudoClassSelector,
	PseudoElementSelector,
	SelectorAttribute,
	SelectorClass,
	SelectorElement,
	SelectorId,
	UniversalSelector
} from "./tokens.mjs"

import {
	SelectorHash,
	SelectorDot,
	DoubleColon,
	Colon,
	Any,
	RectOp,
	RectCl,
	Ampersand,
	Space
} from "../char/tokens.mjs"

import { AttributeParser, parseIdentifier } from "./attribute/parser.mjs"

import { function as _f } from "@hgargg-0710/one"
import { SubSelector } from "../bracket/tokens.mjs"
import { SelectorPartial } from "../escaped/tokens.mjs"
const { trivialCompose } = _f

const readSimple = (SelectorType, skipFirst) => (input) => {
	if (skipFirst !== false) input.next()
	return [SelectorType(parseIdentifier(input))]
}

const attributeHandler = trivialCompose(
	(x) => x.map(SelectorAttribute),
	AttributeParser,
	InputStream,
	limit((input) => !RectCl.is(input.curr()))
)

const skipSpaces = skip(trivialCompose(is(Space), current))

// ! FIX THE EXPORTS (API, names...)
export const selectorMap = PredicateMap(
	new Map([
		[SelectorPartial, readSimple(SelectorElement, false)],
		[SelectorHash.is, readSimple(SelectorId)],
		[SelectorDot.is, readSimple(SelectorClass)],
		[RectOp.is, wrapped(attributeHandler)],
		[DoubleColon.is, readSimple(PseudoElementSelector)],
		[
			Colon.is,
			function (input) {
				input.next() // :
				const name = parseIdentifier(input)
				// ! PROOBLLEM [1]: this thing is SUPPOSED TO work with ALL the identifiers (and not just here...);
				// ! problem [2]: only ONE space is to be ignored. 
				// ! problem [3]: INSIDE A STRING - one must skip a newline, when encountering '\\' (that being, one must CHECK IF a given 'Escaped' is an 'Escaped(Space)');
				// ^ CONCLUSION [3.1]: order of parsing MUST BE CHANGED again (this time - SPACES are found BEFORE back-slashed characters in Tokenizer)
				// ! problem [4]: one must _LIMIT_ the 'escaped' by 6 characters. [IF it's exactly 6, then the 'Space' is not skipped, OTHERWISE - skip it]...; 
				skipSpaces(input)
				const args = ((x) => (SubSelector.is(x) ? x : false))(input.curr())
				if (args) input.next()
				return args
					? [
							PseudoClassSelector({
								name,
								args
							})
					  ]
					: [PseudoClassSelector({ name }), Space(" ")]
			}
		],
		[Any.is, trivialCompose(output, UniversalSelector, next)],
		[Ampersand.is, trivialCompose(output, ParentSelector, next)]
	]),
	forward
)

export const SimpleSelectorParser = BasicParser(selectorMap)
