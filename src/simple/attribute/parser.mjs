import {
	PredicateMap,
	StreamParser,
	TokenSource,
	TypeMap,
	limit,
	miss,
	read,
	skip
} from "@hgargg-0710/parsers.js"
import { SelectorSymbol } from "../../char/tokens.mjs"
import { AttributeName, SelectorIdentifier, isMatch } from "./tokens.mjs"
import { SelectorString } from "../../string/tokens.mjs"

export const attributeMap = TypeMap(PredicateMap)(
	new Map([
		[
			SelectorSymbol,
			function (input) {
				const name = read(
					(input) => SelectorSymbol.is(input.curr()),
					TokenSource(AttributeName(""))
				)(input).value.value

				console.log()
				console.log(input.curr())
				console.log(name)

				let comparison
				skip(input)(
					(input) =>
						!isMatch(input.curr()) || ((comparison = input.next()) && false)
				)
				console.log()
				console.log(input.curr())
				console.log(comparison)

				let isString = false
				skip(input)(
					(input) =>
						!SelectorSymbol.is(input.curr()) &&
						!(isString = SelectorString.is(input.curr()))
				)

				const value = isString
					? input.curr()
					: read(
							() => true,
							TokenSource(SelectorIdentifier(""))
					  )(
							InputStream(
								limit((input) => SelectorSymbol.is(input.curr()))(input)
							)
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
