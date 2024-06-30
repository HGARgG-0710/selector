import {
	BasicParser,
	PredicateMap,
	current,
	forward,
	limit,
	output
} from "@hgargg-0710/parsers.js"
import { CompoundSelector, isSelector } from "./tokens.mjs"
import { function as _f } from "@hgargg-0710/one"

const { trivialCompose } = _f

export const CompoundHandler = trivialCompose(
	output,
	CompoundSelector,
	limit(trivialCompose(isSelector, current))
)

export const compoundMap = PredicateMap(
	new Map([[isSelector, (input) => CompoundHandler(input, [])]]),
	forward
)
export const CompoundSelectorParser = BasicParser(compoundMap)
