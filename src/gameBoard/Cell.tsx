import React, { useContext, useEffect } from "react"
import { SyntheticEvent } from "react"
import classnames from "classnames"
import { boardSlice } from "./slice"

import { BoardContext } from "./Board"

export type CellProps = {
  row: number
  col: number
  fill?: "circle" | "cross" | "empty"
  highlight?: "win" | "error" | "ok" | "empty"
}

export default function Cell(props: CellProps) {
  const { state, dispatch } = useContext(BoardContext)
  return (
    <div
      className={classnames(
        "cell",
        `cell-${props.fill}`,
        `cell-${props.highlight}`
      )}
      onClick={() => dispatch && dispatch(boardSlice.actions.putPiece(props))}
      onMouseEnter={() =>
        dispatch && dispatch(boardSlice.actions.checkValid(props))
      }
      onMouseOut={() =>
        dispatch && dispatch(boardSlice.actions.clearCheck(props))
      }
    >
      {props.fill === "circle" && "O"}
      {props.fill === "cross" && "X"}
    </div>
  )
}

Cell.defaultProps = {
  fill: "empty",
  hightlight: "empty"
}
