import { AnyAction } from "@reduxjs/toolkit"
import React, { useReducer, createContext } from "react"
import Cell, { CellProps } from "./Cell"

import { boardSlice, initialState } from "./slice"

type BoardContextType = {
  state: {
    whoIsNext: "circle" | "cross"
    cells: CellProps[]
  }
  dispatch: React.Dispatch<AnyAction>
}

export const BoardContext = createContext<Partial<BoardContextType>>({})

export default function Board() {
  const [state, dispatch] = useReducer(boardSlice.reducer, initialState)
  if (state.cells.length === 0) {
    new Array(state.boardSize)
      .fill(0)
      .map((_, i) => i + 1)
      .forEach((row) => {
        new Array(state.boardSize)
          .fill(0)
          .map((_, i) => i + 1)
          .forEach((col) => {
            state.cells.push({
              row,
              col,
              fill: "empty",
              highlight: "empty"
            })
          })
      })
  }

  const maxRow = Math.max(...state.cells.map((c) => c.row))
  const maxCol = Math.max(...state.cells.map((c) => c.col))
  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {new Array(maxRow).fill(0).map((_, i) => (
        <div key={`row-${i + 1}`}>
          {new Array(maxCol).fill(0).map((_, j) => {
            const cell = state.cells.find(
              (c) => c.row === i + 1 && c.col === j + 1
            )
            return (
              cell && (
                <Cell
                  row={cell.row}
                  col={cell.col}
                  fill={cell.fill}
                  highlight={cell.highlight}
                  key={`cell-${cell.row}-${cell.col}`}
                />
              )
            )
          })}
        </div>
      ))}
      {state.win === "empty" && (
        <div>Player {state.whoIsNext === "circle" ? "O" : "X"}'s turn</div>
      )}
      {state.win !== "empty" && (
        <div>Player {state.win === "circle" ? "O" : "X"} wins</div>
      )}
    </BoardContext.Provider>
  )
}
