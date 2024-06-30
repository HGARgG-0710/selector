import { BasicParser, PredicateMap, forward } from "@hgargg-0710/parsers.js"
import { CompoundSelector } from "../compound/tokens.mjs"
import { isCombinator, CombinatorToken } from "./tokens.mjs"

export function HandleCompound(input, parser) {
	const selector = input.next()
	const combinator = input.next()
	return [
		combinator
			? CombinatorToken({
					combinator,
					args: [selector, ...parser(input)]
			  })
			: selector
	]
}

export function HandleCombinator(input, parser) {
	const combinator = input.next()
	return [
		CombinatorToken({
			combinator,
			args: parser(input)
		})
	]
}

export const combinatorMap = PredicateMap(
	new Map([
		[CompoundSelector.is, HandleCompound],
		[isCombinator, HandleCombinator]
	]),
	forward
)

export const SelectorCombinatorParser = BasicParser(combinatorMap, [])
