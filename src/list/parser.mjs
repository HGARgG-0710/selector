import { StreamParser, limit } from "@hgargg-0710/parsers.js"
import { Comma } from "../char/tokens.mjs"
export const SelectorListParser = StreamParser(limit((input) => !Comma.is(input.curr())))