import { createSlice } from "@reduxjs/toolkit"
import { CellProps } from "./Cell"
import { createSelector } from "reselect"

export const initialState = {
  boardSize: 10,
  winLength: 5,
  win: "empty" as "circle" | "cross" | "empty",
  whoIsNext: "circle" as "circle" | "cross",
  cells: [] as CellProps[]
}

const getCellByPosition = (row: number, col: number) => {
  return createSelector(
    (state: typeof initialState) => state.cells,
    (cells) => cells.find((c) => c.row === row && c.col === col)
  )
}

const checkWin = (state: typeof initialState) => {
  let winCells: (CellProps | undefined)[] = []
  state.cells.some((c) => {
    if (c.fill === "empty") return false
    const down = new Array(state.winLength)
      .fill(0)
      .map((_, i) => {
        return getCellByPosition(c.row + i, c.col)(state)
      })
      .filter((cc) => cc && cc.fill === c.fill)
    if (down.length === state.winLength) {
      winCells = down
      return true
    }
    const right = new Array(state.winLength)
      .fill(0)
      .map((_, i) => {
        return getCellByPosition(c.row, c.col + i)(state)
      })
      .filter((cc) => cc && cc.fill === c.fill)
    if (right.length === state.winLength) {
      winCells = right
      return true
    }
    const corner1 = new Array(state.winLength)
      .fill(0)
      .map((_, i) => {
        return getCellByPosition(c.row + i, c.col + i)(state)
      })
      .filter((cc) => cc && cc.fill === c.fill)
    if (corner1.length === state.winLength) {
      winCells = corner1
      return true
    }
    const corner2 = new Array(state.winLength)
      .fill(0)
      .map((_, i) => {
        return getCellByPosition(c.row + i, c.col - i)(state)
      })
      .filter((cc) => cc && cc.fill === c.fill)
    if (corner2.length === state.winLength) {
      winCells = corner2
      return true
    }
    return false
  })
  return winCells
}

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    putPiece: (state, action) => {
      const cell = getCellByPosition(
        action.payload.row,
        action.payload.col
      )(state)
      if (cell && cell.fill === "empty" && state.win === "empty") {
        cell.fill = state.whoIsNext
        const winCells = checkWin(state)
        if (winCells.length > 0) {
          state.win = (winCells[0] as CellProps).fill || "empty"
          winCells.forEach((c) => c && (c.highlight = "win"))
        }
        state.whoIsNext = state.whoIsNext === "circle" ? "cross" : "circle"
      }
    },
    checkValid: (state, action) => {
      const cell = getCellByPosition(
        action.payload.row,
        action.payload.col
      )(state)
      if (cell && cell.highlight !== "win") {
        if (cell.fill === "empty") {
          cell.highlight = "ok"
        } else {
          cell.highlight = "error"
        }
      }
    },
    clearCheck: (state, action) => {
      const cell = getCellByPosition(
        action.payload.row,
        action.payload.col
      )(state)
      cell && cell.highlight !== "win" && (cell.highlight = "empty")
    }
  }
})
