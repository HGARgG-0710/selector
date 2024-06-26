import {
	PredicateMap,
	StreamParser,
	current,
	forward,
	limit,
	output
} from "@hgargg-0710/parsers.js"
import { CompoundSelector, Selector } from "./tokens.mjs"
import { function as _f } from "@hgargg-0710/one"

const { trivialCompose } = _f

export const compoundMap = PredicateMap(
	new Map([
		[
			Selector,
			trivialCompose(
				output,
				CompoundSelector,
				limit(trivialCompose(Selector, current))
			)
		]
	]),
	forward
)
export const CompoundSelectorParser = StreamParser(compoundMap)
