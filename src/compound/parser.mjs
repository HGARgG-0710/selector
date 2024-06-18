import { PredicateMap, StreamParser, limit, preserve } from "@hgargg-0710/parsers.js"
import { CompoundSelector, SelectorType } from "./tokens.mjs"
import { function as _f } from "@hgargg-0710/one"

const { trivialCompose } = _f

export const compoundMap = PredicateMap(
	new Map([
		[
			SelectorType,
			trivialCompose(
				(x) => [x],
				CompoundSelector,
				limit((input) => !SelectorType(input.curr()))
			)
		]
	]),
	preserve
)
export const CompoundSelectorParser = StreamParser(compoundMap)
