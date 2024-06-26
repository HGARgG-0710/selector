import {
	BasicParser,
	InputStream,
	PredicateMap,
	TokenSource,
	TypeMap,
	current,
	forward,
	is,
	read
} from "@hgargg-0710/parsers.js"
import { SelectorSymbol } from "../../char/tokens.mjs"
import { IdentifierCharacters, SelectorIdentifier } from "./tokens.mjs"

import { function as _f } from "@hgargg-0710/one"

const { trivialCompose } = _f

const readSymbol = read(trivialCompose(is(SelectorSymbol), current))

export const identifierMap = TypeMap(PredicateMap)(
	new Map([
		[
			SelectorSymbol,
			(input) => [readSymbol(input, TokenSource(IdentifierCharacters(""))).value]
		]
	]),
	forward
)
export const IdentifierParser = trivialCompose(
	SelectorIdentifier,
	BasicParser(identifierMap),
	InputStream
)
