import {
	PredicateMap,
	StreamParser,
	current,
	miss,
	skip,
	is,
	forward,
	BasicParser,
	destroy
} from "@hgargg-0710/parsers.js"
import { CompoundSelector } from "../compound/tokens.mjs"
import { Combinator } from "../combinator/tokens.mjs"
import { Space } from "../char/tokens.mjs"

import { function as _f } from "@hgargg-0710/one"

const { trivialCompose } = _f

// ! REFACTOR THESE KINDS OF THINGS!!!
const skipSpaces = skip(trivialCompose(is(Space), current))
export const singleSpaceMap = PredicateMap(
	new Map([
		[Space.is, destroy],
		[
			CompoundSelector.is,
			function (input) {
				const compound = input.next()
				if (Space.is(input.curr())) {
					const space = input.next()
					skipSpaces(input)
					return [compound].concat([
						...(CompoundSelector.is(input.curr()) ? [space] : [])
					])
				}
				return [compound]
			}
		],
		[Combinator, forward]
	]),
	forward
)

export const DeSpaceSelector = BasicParser(singleSpaceMap)
