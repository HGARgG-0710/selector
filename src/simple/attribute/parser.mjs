import { PredicateMap, StreamParser, miss, skip } from "@hgargg-0710/parsers.js"
import { isMatch } from "./tokens.mjs"
import { SelectorString } from "../../string/tokens.mjs"
import { SelectorPartial } from "../../escaped/tokens.mjs"
import { parseIdentifier } from "../identifier/parser.mjs"

export function AttributeHandler(input) {
	const name = parseIdentifier(input)

	let comparison
	skip(
		(input) =>
			!SelectorPartial(input.curr()) &&
			(!isMatch(input.curr()) || ((comparison = input.next()) && false))
	)(input)

	let isString = false
	if (comparison)
		skip(
			(input) =>
				!SelectorPartial(input.curr()) &&
				!(isString = SelectorString.is(input.curr()))
		)(input)

	const value = isString ? (comparison ? input.curr() : false) : parseIdentifier(input)

	return [
		comparison
			? {
					name,
					comparison,
					value
			  }
			: {
					name
			  }
	]
}

export const attributeMap = PredicateMap(
	new Map([[SelectorPartial, AttributeHandler]]),
	miss
)
export const AttributeParser = StreamParser(attributeMap)
