import {
	BasicParser,
	InputStream,
	PredicateMap,
	TokenSource,
	TypeMap,
	current,
	destroy,
	forward,
	is,
	read,
	limit
} from "@hgargg-0710/parsers.js"
import { SelectorSymbol, Space } from "../../char/tokens.mjs"
import { IdentifierCharacters, SelectorIdentifier } from "./tokens.mjs"
import { SelectorPartial, Escaped } from "../../escaped/tokens.mjs"

import { function as _f } from "@hgargg-0710/one"

const { trivialCompose } = _f

export const readSymbol = read(trivialCompose(is(SelectorSymbol), current))

export const identifierMap = TypeMap(PredicateMap)(
	new Map([
		[
			SelectorSymbol,
			(input) => [readSymbol(input, TokenSource(IdentifierCharacters(""))).value]
		],
		[Space, destroy]
	]),
	forward
)
export const IdentifierParser = trivialCompose(
	SelectorIdentifier,
	BasicParser(identifierMap),
	InputStream
)

export const limitPartial = limit((input) => {
	if (SelectorPartial(input.curr())) return true
	if (Space.is(input.curr())) {
		input.prev()
		return (
			(Escaped.is(input.curr()) && input.next().value.length !== 6) ||
			(input.next() && false)
		)
	}
	return false
})
export const parseIdentifier = trivialCompose(IdentifierParser, limitPartial)
