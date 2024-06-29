import {
	PredicateMap,
	current,
	skip,
	is,
	forward,
	BasicParser,
	destroy
} from "@hgargg-0710/parsers.js"
import { CompoundSelector } from "../compound/tokens.mjs"
import { isCombinator } from "../combinator/tokens.mjs"
import { Space } from "../char/tokens.mjs"

import { function as _f } from "@hgargg-0710/one"

const { trivialCompose } = _f

export const skipSpaces = skip(trivialCompose(is(Space), current))
export function DeSpace(input) {
	const compound = input.next()
	if (Space.is(input.curr())) {
		const space = input.next()
		skipSpaces(input)
		return [compound].concat([...(CompoundSelector.is(input.curr()) ? [space] : [])])
	}
	return [compound]
}

export const singleSpaceMap = PredicateMap(
	new Map([
		[Space.is, destroy],
		[CompoundSelector.is, DeSpace],
		[isCombinator, forward]
	]),
	forward
)

export const DeSpaceSelector = BasicParser(singleSpaceMap)
