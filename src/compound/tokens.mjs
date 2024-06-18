import { TokenType } from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"
import {
	PseudoClassSelector,
	PseudoElementSelector,
	SelectorAttribute,
	SelectorClass,
	SelectorElement,
	SelectorId,
	UniversalSelector
} from "../simple/tokens.mjs"

const { or } = _f

export const CompoundSelector = TokenType("compound")
export const Selector = or(
	...[
		SelectorElement,
		SelectorId,
		SelectorClass,
		SelectorAttribute,
		PseudoClassSelector,
		PseudoElementSelector,
		UniversalSelector
	].map((x) => x.is)
)
