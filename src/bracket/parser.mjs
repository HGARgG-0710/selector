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
	wrapped
} from "@hgargg-0710/parsers.js"
import { ClBrack, OpBrack } from "../char/tokens.mjs"

import { function as _f } from "@hgargg-0710/one"
import { SubSelector } from "./tokens.mjs"

const { trivialCompose } = _f

const nestedBrack = trivialCompose(
	InputStream,
	nested(...[OpBrack, ClBrack].map((Border) => trivialCompose(is(Border), current)))
)

export const SubSelectorHandler = trivialCompose(
	output,
	wrapped(trivialCompose(SubSelector, (input) => EndParser(nestedBrack(input))))
)

const subSelectorMap = TypeMap(PredicateMap)(
	new Map([[OpBrack, SubSelectorHandler]]),
	forward
)

const finaleParser = trivialCompose(
	...[
		SelectorCombinatorParser,
		DeSpaceSelector,
		CompoundSelectorParser,
		SimpleSelectorParser
	]
		.map((x) => [x, InputStream])
		.flat()
)

const structureParser = (x) =>
	x instanceof Array && x[0] instanceof Array
		? x.length - 1
			? SelectorListToken(x.map(structureParser))
			: structureParser(x[0])
		: finaleParser(x)[0]

export const BracketParser = BasicParser(subSelectorMap)
export const SelectorListParser = trivialCompose(
	SelectorCommaParser,
	InputStream,
	BracketParser
)
export const EndParser = trivialCompose(structureParser, SelectorListParser)
