import { PredicateMap, StreamParser, miss, preserve, skip } from "@hgargg-0710/parsers.js"
import { CompoundSelector } from "../compound/tokens.mjs"
import { Combinator } from "../combinator/tokens.mjs"
import { Space } from "../char/tokens.mjs"

export const singleSpaceMap = PredicateMap(
	new Map([
		[Space, miss],
		[
			CompoundSelector.is,
			function (input) {
				const compound = input.next()
				if (Space.is(input.curr())) {
					const space = input.next()
					skip(input)((input) => Space.is(input.curr()))
					return [compound].concat([
						...(CompoundSelector.is(input.curr()) ? [space] : []),
						input.curr()
					])
				}
				return [compound, input.curr()]
			}
		],
		[Combinator, preserve]
	]),
	preserve
)

export const DeSpaceSelector = StreamParser(singleSpaceMap)
