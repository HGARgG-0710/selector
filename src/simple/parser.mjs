import {
	TypeMap,
	PredicateMap,
	TokenSource,
	read,
	limit,
	InputStream,
	skip,
	BasicParser
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
	SelectorSymbol,
	RectOp,
	RectCl,
	Ampersand,
	Space
} from "../char/tokens.mjs"

import { AttributeParser } from "./attribute/parser.mjs"

import { function as _f } from "@hgargg-0710/one"
import { SubSelector } from "../bracket/tokens.mjs"
const { trivialCompose } = _f

const readSymbol = (init = "") =>
	read((input) => SelectorSymbol.is(input.curr()), TokenSource(init))

const readSimple = (SelectorType, skipFirst) => (input) => {
	if (skipFirst !== false) input.next()
	return [readSymbol(SelectorType(""))(input).value]
}

const attributeHandler = trivialCompose(
	(x) => x.map(SelectorAttribute),
	AttributeParser,
	InputStream,
	limit((input) => !RectCl.is(input.curr()))
)

// ! FIX THE EXPORTS (API, names...)
export const selectorMap = TypeMap(PredicateMap)(
	new Map([
		[SelectorHash, readSimple(SelectorId)],
		[SelectorDot, readSimple(SelectorClass)],
		[
			RectOp,
			function (input) {
				input.next() // [
				const attributes = attributeHandler(input)
				input.next() // ]
				return attributes
			}
		],
		[DoubleColon, readSimple(PseudoElementSelector)],
		[
			Colon,
			function (input) {
				const name = readSymbol()(input)
				skip((input) => Space.is(input.curr()))(input)
				const args = ((x) => (SubSelector.is(x) ? x : false))(input.curr())
				if (args) input.next()
				return [
					PseudoClassSelector(
						args
							? {
									name,
									args
							  }
							: { name }
					)
				]
			}
		],
		[Any, (input) => [UniversalSelector(input.next())]],
		[SelectorSymbol, readSimple(SelectorElement, false)],
		[Ampersand, (input) => [ParentSelector(input.next())]]
	]),
	(input) => [input.next()]
)

export const SimpleSelectorParser = BasicParser(selectorMap)
