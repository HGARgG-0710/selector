import { SimpleSelectorParser } from "../simple/parser.mjs"
import { CompoundSelectorParser } from "../compound/parser.mjs"
import { SelectorCombinatorParser } from "../combinator/parser.mjs"

import { SelectorCommaParser } from "../list/parser.mjs"
import { DeSpaceSelector } from "../despace/parser.mjs"
import { SelectorListToken } from "../list/tokens.mjs"

import {
	BasicParser,
	InputStream,
	PredicateMap,
	TypeMap,
	current,
	forward,
	is,
	nested,
	output,
	transform,
	wrapped
} from "@hgargg-0710/parsers.js"
import { ClBrack, OpBrack } from "../char/tokens.mjs"

import { function as _f } from "@hgargg-0710/one"
import { SubSelector } from "./tokens.mjs"

const { trivialCompose } = _f

const subSelectorMap = TypeMap(PredicateMap)(
	new Map([
		[
			OpBrack,
			trivialCompose(output, wrapped(trivialCompose(SubSelector, parentSelector)))
		]
	]),
	forward
)

const structureParser = trivialCompose(
	...[
		SelectorCombinatorParser,
		DeSpaceSelector,
		CompoundSelectorParser,
		SimpleSelectorParser
	]
		.map((x) => [x, InputStream])
		.flat(),
	(x) =>
		x.length - 1 ? SelectorListToken(x.map(structureParser)) : structureParser(x[0])
)

export const SelectorListParser = trivialCompose(SelectorCommaParser, BracketParser)
export const BracketParser = BasicParser(subSelectorMap)
export const EndParser = trivialCompose(
	SelectorListParser,
	structureParser,
	BracketParser
)

const parentSelector = trivialCompose(
	trivialCompose(transform, EndParser),
	InputStream,
	nested(...[OpBrack, ClBrack].map((Border) => trivialCompose(is(Border), current)))
)
