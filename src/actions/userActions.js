'use strict'
import axios from 'axios'

export function fetchGameDetails () {
  return function (dispatch) {
    axios
      .get('http://starlord.hackerearth.com/gamesext')
      .then(function (response) {
        dispatch({
          type: 'FETCH_GAME_DETAILS',
          payload: response.data
        })
      })
      .catch(function (err) {
        dispatch({
          type: 'FETCH_GAME_DETAILS_REJECTED',
          payload: 'Failed in Fetching Details'
        })
      })
  }
}

export function applyFilters (searchText) {
  return function (dispatch) {
    axios
      .get('http://starlord.hackerearth.com/gamesext')
      .then(function (response) {
        let filteredPlayers = response.data.filter(
          player => player.title === searchText
        )
        dispatch({
          type: 'APPLY_FILTERS',
          payload: filteredPlayers
        })
      })
      .catch(function (err) {
        dispatch({
          type: 'FETCH_GAME_DETAILS_REJECTED',
          payload: 'Failed in Fetching Details'
        })
      })
  }
}

export function resetSearchArray () {
  return function (dispatch) {
    dispatch({
      type: 'RESET_SEARCH_ARRAY'
    })
  }
}

export function filterAdd (value) {
  return function (dispatch) {
    dispatch({
      type: 'ADD_FILTERS',
      payload: value
    })
  }
}

export function filterRemove () {
  return function (dispatch) {
      dispatch({
        type: 'REMOVE_FILTERS',
      })
  }
}
