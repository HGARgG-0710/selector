import { TokenType } from "@hgargg-0710/parsers.js"

export const [
	SelectorElement,
	SelectorId,
	SelectorClass,
	SelectorAttribute,
	PseudoClassSelector,
	PseudoElementSelector,
	UniversalSelector, 
	ParentSelector
] = [
	"element",
	"id",
	"class",
	"attribute",
	"pseudo-class",
	"pseudo-element",
	"universal", 
	"parent"
].map(TokenType)
