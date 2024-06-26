import { TokenType } from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"
import {
	ParentSelector,
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
		UniversalSelector,
		ParentSelector
	].map((x) => x.is)
)