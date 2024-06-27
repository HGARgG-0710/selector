import { PredicateMap, StreamParser, limit, miss, skip } from "@hgargg-0710/parsers.js"
import { isMatch } from "./tokens.mjs"
import { SelectorString } from "../../string/tokens.mjs"
import { SelectorPartial, Escaped } from "../../escaped/tokens.mjs"
import { trivialCompose } from "@hgargg-0710/one/src/functions/functions.mjs"
import { IdentifierParser } from "../identifier/parser.mjs"
import { Space } from "../../char/tokens.mjs"

// TODO: REFACTOR THESE KINDS OF DEFINITIONS THROUGHOUT THE LIBRARY...
const limitPartial = limit((input) => {
	if (SelectorPartial(input.curr())) return true
	if (Space.is(input.curr())) {
		input.prev()
		return (
			(Escaped.is(input.curr()) && input.next().value.length !== 6) ||
			(input.next() && false)
		)
	}
	return false
})
export const parseIdentifier = trivialCompose(IdentifierParser, limitPartial)

export const attributeMap = PredicateMap(
	new Map([
		[
			SelectorPartial,
			function (input) {
				const name = parseIdentifier(input)

				let comparison
				skip(
					(input) =>
						!isMatch(input.curr()) || ((comparison = input.next()) && false)
				)(input)

				let isString = false
				skip(
					(input) =>
						!SelectorPartial(input.curr()) &&
						!(isString = SelectorString.is(input.curr()))
				)(input)

				const value = isString ? input.curr() : parseIdentifier(input)

				return [
					{
						name,
						comparison,
						value
					}
				]
			}
		]
	]),
	miss
)
export const AttributeParser = StreamParser(attributeMap)
