'use strict'
import uniq from 'lodash/uniq'
import _ from 'lodash'

const defaultState = {
  filters: []
}

export function userReducers (state = {players: []}, action) {
  switch (action.type) {
    case 'FETCH_GAME_DETAILS': {
      // let players = state.players.concat(action.payload);
      const totalAvailablePages = Math.floor(action.payload.length / 50)
      const totalCount = action.payload.length
      let allTitles = action.payload.map(game => game.title)
      allTitles = uniq(allTitles)
      return {
        players: action.payload,
        totalPages: totalAvailablePages,
        totalCount: totalCount,
        perPage: 50,
        availableTitles: allTitles
      }
      break
    }

    case 'APPLY_FILTERS': {
      const totalAvailablePages = Math.floor(action.payload.length / 50)
      const totalCount = action.payload.length
      return {
        ...state,
        players: action.payload,
        totalPages: totalAvailablePages,
        totalCount: totalCount,
        perPage: 50,
        filters: []
      }
      break
    }

    case 'RESET_SEARCH_ARRAY': {
      return {
        ...state,
        players: undefined,
        totalPages: 0,
        totalCount: 0,
        perPage: 50,
        filters: []
      }
      break
    }

    case 'ADD_FILTERS': {
      // let filters = state.players.concat(...state.players,{filters:action.payload})
      let filteredList
      if (action.payload == 'Incresing') {
        filteredList = _.orderBy(
          state.players,
          function (item) {
            return item.score
          },
          ['asc']
        )
      }
      if (action.payload == 'Decresing') {
        filteredList = _.orderBy(
          state.players,
          function (item) {
            return item.score
          },
          ['desc']
        )
      }
      const totalAvailablePages = Math.floor(state.players.length / 50)
      const totalCount = state.players.length

      return {
        ...state,
        players: filteredList,
        filters: [...defaultState.filters, action.payload],
        totalPages: totalAvailablePages,
        totalCount: totalCount,
        perPage: 50
      }
    }

    case 'REMOVE_FILTERS': {
      const totalAvailablePages = Math.floor(state.players.length / 50);
      const totalCount = state.players.length;

        return {
          ...state,
          players: state.players,
          totalPages: totalAvailablePages,
          totalCount: totalCount,
          perPage: 50,
          filters: []
        }
    }

    default:
      return {
        ...state
      }
  }
  return state
}
