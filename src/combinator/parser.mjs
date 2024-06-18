import { PredicateMap, StreamParser } from "@hgargg-0710/parsers.js"
import { CompoundSelector } from "../compound/tokens.mjs"
import { Combinator } from "./tokens.mjs"

export const combinatorMap = PredicateMap(
	new Map([
		[
			CompoundSelector.is,
			function (input, parser) {
				const selector = input.next()
				const combinator = input.next()
				return [
					{
						combinator,
						args: [selector, ...parser(input)]
					}
				]
			}
		],
		[
			Combinator,
			function (input, parser) {
				const combinator = input.next()
				return [
					{
						combinator,
						args: parser(input)
					}
				]
			}
		]
	]),
	preserve
)

export const SelectorCombinatorParser = StreamParser(combinatorMap)
