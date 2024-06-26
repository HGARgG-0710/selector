import {
	PredicateMap,
	StreamParser,
	TokenSource,
	current,
	limit,
	miss,
	read,
	skip,
	InputStream
} from "@hgargg-0710/parsers.js"
import { AttributeName, SelectorIdentifier, isMatch } from "./tokens.mjs"
import { SelectorString } from "../../string/tokens.mjs"
import { SelectorPartial } from "../../escaped/tokens.mjs"
import { trivialCompose } from "@hgargg-0710/one/src/functions/functions.mjs"

// TODO: REFACTOR THESE KINDS OF DEFINITIONS THROUGHOUT THE LIBRARY...
const readName = read(trivialCompose(SelectorPartial, current))
const limitPartial = limit((input) => SelectorPartial(input.curr()))

export const attributeMap = PredicateMap(
	new Map([
		[
			SelectorPartial,
			function (input) {
				const name = readName(input, TokenSource(AttributeName(""))).value.value

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
					: read(() => true)(
							InputStream(limitPartial(input)),
							TokenSource(SelectorIdentifier(""))
					  )

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
