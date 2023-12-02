// Custom imports
import { LocalProblem } from "@/types";
import { jumpGame } from "./jump-game";
import { reverseLinkedList } from "./reverse-linked-list";
import { search2DMatrix } from "./search-a-2d-matrix";
import { twoSum } from "./two-sum";
import { validParentheses } from "./valid-parentheses";
import { findMax } from "./find-max";

type Map = {
    [key: string]: LocalProblem;
}

/**
 * Lookup map that uses as key the problem name and returns
 * as value the associated problem info (i.e., Problem).
 */
const ProblemLookup: Map = {
    'two-sum': twoSum,
    'reverse-linked-list': reverseLinkedList,
    'jump-game': jumpGame,
    'search-a-2d-matrix': search2DMatrix,
    'valid-parentheses': validParentheses,
    'find-max': findMax,
};
export default ProblemLookup;