import { PredicateMap, StreamParser, limit } from "@hgargg-0710/parsers.js"
import { CompoundSelector, Selector } from "./tokens.mjs"
import { function as _f } from "@hgargg-0710/one"

const { trivialCompose } = _f

export const compoundMap = PredicateMap(
	new Map([
		[
			Selector,
			trivialCompose(
				(x) => [x],
				CompoundSelector,
				limit((input) => Selector(input.curr()))
			)
		]
	]),
	(input) => [input.next()]
)
export const CompoundSelectorParser = StreamParser(compoundMap)
