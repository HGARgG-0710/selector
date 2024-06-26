import {
	PredicateMap,
	StreamParser,
	TokenSource,
	limit,
	miss,
	read,
	skip
} from "@hgargg-0710/parsers.js"
import { AttributeName, SelectorIdentifier, isMatch } from "./tokens.mjs"
import { SelectorString } from "../../string/tokens.mjs"
import { SelectorPartial } from "../../escaped/tokens.mjs"

// TODO: REFACTOR THESE KINDS OF DEFINITIONS THROUGHOUT THE LIBRARY...
const limitPartial = limit((input) => SelectorPartial(input.curr()))

export const attributeMap = PredicateMap(
	new Map([
		[
			SelectorPartial,
			function (input) {
				const name = read(
					(input) => SelectorPartial(input.curr()),
					TokenSource(AttributeName(""))
				)(input).value.value

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

				const value = isString
					? input.curr()
					: read(
							() => true,
							TokenSource(SelectorIdentifier(""))
					  )(InputStream(limitPartial(input)))

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
