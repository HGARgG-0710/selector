import {
	TypeMap,
	PredicateMap,
	TokenSource,
	read,
	preserve,
	skip,
	StreamParser,
	limit
} from "@hgargg-0710/parsers.js"

import {
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
	Space,
	DoubleColon,
	Colon,
	Any,
	Namespace,
	Sibling,
	SelectorSymbol,
	Child,
	Plus,
	RectCl
} from "../char/tokens.mjs"

import { AttributeParser } from "./attribute/parser.mjs"

import { function as _f } from "@hgargg-0710/one"
const { trivialCompose } = _f

const readSymbol = [
	[SelectorId],
	[SelectorClass],
	[PseudoElementSelector],
	[PseudoClassSelector],
	[SelectorElement, false]
].map(([SelectorType, skipFirst]) => (input) => {
	if (skipFirst !== false) input.next()
	return [
		read(
			(input) => SelectorSymbol.is(input.curr()),
			TokenSource(SelectorType(""))
		)(input).value
	]
})

const attributeHandler = trivialCompose(
	(x) => x.map(SelectorAttribute),
	AttributeParser,
	InputStream,
	limit((input) => !RectCl.is(input.curr()))
)

// ! FIX THE EXPORTS (API, names...)
export const selectorMap = TypeMap(PredicateMap)(
	new Map(
		[
			[SelectorHash, readSymbol[0]],
			[SelectorDot, readSymbol[1]],
			[
				RectOp,
				function (input) {
					input.next() // [
					return [attributeHandler(input)]
				}
			],
			[DoubleColon, readSymbol[2]],
			[Colon, readSymbol[3]],
			[Any, (input) => [UniversalSelector(input.curr())]],
			[SelectorSymbol, readSymbol[4]]
		],
		preserve
	)
)

export const SimpleSelectorParser = StreamParser(selectorMap)
