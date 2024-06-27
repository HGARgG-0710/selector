import {
	PredicateMap,
	limit,
	InputStream,
	BasicParser,
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
	Ampersand
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
		[Any.is, trivialCompose(output, UniversalSelector, next)],
		[Ampersand.is, trivialCompose(output, ParentSelector, next)]
	]),
	forward
)

export const SimpleSelectorParser = BasicParser(selectorMap)
