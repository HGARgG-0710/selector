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

import { AttributeParser } from "./attribute/parser.mjs"
import { parseIdentifier } from "./identifier/parser.mjs"

import { function as _f } from "@hgargg-0710/one"
import { SubSelector } from "../bracket/tokens.mjs"
import { SelectorPartial } from "../escaped/tokens.mjs"
const { trivialCompose } = _f

export const readSimple = (SelectorType, skipFirst) => (input) => {
	if (skipFirst !== false) input.next()
	return [SelectorType(parseIdentifier(input))]
}

export function HandlePseudoClass(input) {
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

export const HandleElement = readSimple(SelectorElement, false)
export const HandleId = readSimple(SelectorId)
export const HandleClass = readSimple(SelectorClass)
export const HandleAttribute = wrapped(
	trivialCompose(
		(x) => x.map(SelectorAttribute),
		AttributeParser,
		InputStream,
		limit((input) => !RectCl.is(input.curr()))
	)
)
export const HandlePseudoElement = readSimple(PseudoElementSelector)
export const HandleUniversal = trivialCompose(output, UniversalSelector, next)
export const HandleParent = trivialCompose(output, ParentSelector, next)

export const simpleMap = PredicateMap(
	new Map([
		[SelectorPartial, HandleElement],
		...[
			[SelectorHash, HandleId],
			[SelectorDot, HandleClass],
			[RectOp, HandleAttribute],
			[Colon, HandlePseudoClass],
			[DoubleColon, HandlePseudoElement],
			[Any, HandleUniversal],
			[Ampersand, HandleParent]
		].map(([Type, Funct]) => [Type.is, Funct])
	]),
	forward
)

export const SimpleSelectorParser = BasicParser(simpleMap)
