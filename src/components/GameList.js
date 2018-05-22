'use strict'

import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'
import get from 'lodash/get'
import {
  Card,
  CardTitle,
  CardHeader,
  CardText,
  CardActions
} from 'material-ui/Card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderColumn,
  TableRowColumn
} from 'material-ui/Table'

import {redA200, grey100} from 'material-ui/styles/colors'
import WarningIcon from 'material-ui/svg-icons/alert/warning'
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left'
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right'
import CircularProgress from 'material-ui/CircularProgress'
import AutoComplete from 'material-ui/AutoComplete'
import SearchIcon from 'material-ui/svg-icons/action/search'
import {
  fetchGameDetails,
  applyFilters,
  resetSearchArray,
  filterAdd,
  filterRemove
} from '../actions/userActions'
import Checkbox from 'material-ui/Checkbox'
import Cancel from 'material-ui/svg-icons/Navigation/cancel'

const Container = styled.div`
    width: 100%;
`

const HeaderContainer = styled.div`
width: 100%;
display: flex;
justify-content: flex-end;
margin-top: 0px;
padding: 0 16px 0 0;

& > * {
width: 98.75%;
}
`

const SearchWrapper = styled.div`
display: flex;
align-items: center;
color: '#323765';
& > * + * {
  margin-left: 8px;
}
`

const Wrapper = styled.div`
    margin-top: 16px;
    margin-bottom: 32px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around ;
`

const WrapperLeft = styled.div`
width: 20%;
position: relative;
`

const WrapperRight = styled.div`
width: 75%;
margin-top: 10%;
`
const ButtonContainer = styled.div`
display: flex;
align-items: center;
justify-content: flex-end;
`

const ScrollLeftWrapper = styled.div`
    width: 100%;
    height: 400px;
    overflow-y: scroll;
    overflow-x: hidden;
`

const ScrollRightWrapper = styled.div`
width: 100%;
height: 400px;
overflow-y: scroll;
overflow-x: hidden;
`

const styles = {
  checkbox: {
    paddingLeft: 0,
    paddingBottom: 0,
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 0
  },
  tableStyle: {
    borderCollapse: 'collapse',
    background: 'white',
    tableLayout: 'fixed',
    width: '100%'
  },
  tableHeaderColumnStyle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 500,
    backgroundColor: '#323765',
    padding: '8px 16px',
    border: '1px solid #ddd',
    width: '160px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  tableRowStyle: {
    cursor: 'pointer',
    padding: '8px 16px',
    border: '1px solid #ddd',
    width: '160px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  tableRowColumnStyle: {
    fontSize: 12,
    padding: '8px 16px',
    border: '1px solid #ddd',
    width: '160px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  cardTitleStyle: {
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: redA200,
    width: '100%',
    zIndex: 100
  }
}

const filters = ['Incresing', 'Decresing']

class GameList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pageIndex: 0,
      filterApplied:0,
      gamesCols: [
        {
          name: 'Title',
          value: 'title'
        },
        {
          name: 'Platform',
          value: 'platform'
        },
        {
          name: 'Score',
          value: 'score'
        },
        {
          name: 'Genre',
          value: 'genre'
        },
        {
          name: 'Editors_Choice',
          value: 'editors_choice'
        },
        {
          name: 'Release_Year',
          value: 'release_year'
        }
      ],

      cols: [
        {
          name: 'Filters',
          filterType: 'fixed',
          value: 'filters'
        }
      ]
    }
  }

  componentDidMount () {
    this.props.fetchGameDetails()
  }

  getPreviousPageData = () => {
    const {pageIndex} = this.state
    this.setState({
      pageIndex: pageIndex - 1
    })
  }

  getNextPageData = () => {
    const {pageIndex} = this.state
    this.setState({
      pageIndex: pageIndex + 1
    })
  }

  getList = () => {
    const {perPage, gameList} = this.props
    const {pageIndex} = this.state
    const start = pageIndex * perPage
    const end = Math.min(gameList.length, (pageIndex + 1) * perPage)
    const data = gameList.slice(start, end)
    // const result =  filter(data, filters);
    return data
  }

  handleUpdate = searchString => {
    console.log(searchString)
  }

  handleNewRequest = searchString => {
    const {applyFilters, fetchGameDetails, resetSearchArray} = this.props
    this.setState({
      pageIndex: 0,
      filterApplied:1
    })
    resetSearchArray()
    applyFilters(searchString)
  }

  isFilterApplied (val) {
    const {filters} = this.props

    return filters ? filters.includes(val) : false
  }

  getFixedFilters = () => {
    const {filterAdd, filterRemove} = this.props

    return filters.map(val => (
      <Checkbox
        key={val}
        label={val}
        style={styles.checkbox}
        checked={this.isFilterApplied(val)}
        onCheck={(_, isChecked) => {
          if (isChecked) {
            filterAdd(val)
          } else {
            filterRemove()
          }
        }}
      />
    ))
  }

  geTotalData = () => {
    const {fetchGameDetails, resetSearchArray} = this.props
    this.setState({
      filterApplied: 0
    })
    resetSearchArray()
    fetchGameDetails()
  }

  render () {
    const {gameList, totalCount, totalPages, titles} = this.props
    const {gamesCols, pageIndex, cols ,filterApplied } = this.state
    let row = 0
    let availableList

    if (gameList && gameList.length > 0) {
      availableList = this.getList(gameList)
    }

    // console.log('availableList==============>',availableList);

    return (
      <Container>
        <Card
          zDepth={0}
          style={{
            backgroundColor: 'transparent'
          }}
        >
          <Wrapper>
            <WrapperLeft>
              <Card style={{marginTop: '55%', marginBottom: '16px'}}>
                <ScrollLeftWrapper>
                  <CardText
                    style={{
                      paddingLeft: 0,
                      paddingRight: 0
                    }}
                  >
                    {cols.map(col => {
                      if (typeof col.filterType !== 'undefined') {
                        return (
                          <Card>
                            <CardHeader
                              title={col.name}
                              titleColor={'#323765'}
                              style={{width: '100%'}}
                              actAsExpander
                              showExpandableButton
                            />
                            {col.filterType === 'fixed'
                              ? <CardText style={{paddingBottom: 0}} expandable>
                                {this.getFixedFilters()}
                              </CardText>
                              : null}
                          </Card>
                        )
                      }
                      return null
                    })}
                  </CardText>
                </ScrollLeftWrapper>
              </Card>

            </WrapperLeft>

            <WrapperRight>

              <Card
                style={{
                  border: '1px solid #293d63',
                  width: '35%',
                  borderRadius: '12px',
                  marginLeft: '30%',
                  paddingLeft: 16,
                  paddingTop: 0,
                  paddingBottom: 0,
                  marginBottom: '2%',
                  paddingRight: 16,
                  gravity: 'center'
                }}
              >
                <SearchWrapper>
                  <AutoComplete
                    hintText='Search Using Game Title'
                    floatingLabelText='Search Using Game Title'
                    dataSource={titles || []}
                    // filter={AutoComplete.fuzzyFilter}
                    onUpdateInput={this.handleUpdate}
                    onNewRequest={this.handleNewRequest}
                    maxSearchResults={15}
                    fullWidth
                    disableAutoFocus
                  />

                  { filterApplied === 0 ?  <SearchIcon style={{marginTop: 32}} color={'#323765'} /> :  <Cancel
                    style={{marginTop: 32}}
                    color={'#323765'}
                    cursor={'pointer'}
                    onMouseDown={() => {
                      this.geTotalData()
                    }}
                  /> }
                </SearchWrapper>

              </Card>

              <Card>
                <div>
                  <table style={styles.tableStyle}>
                    <thead>
                      <tr>
                        {gamesCols.map(col => (
                          <TableHeaderColumn
                            key={col.value}
                            style={styles.tableHeaderColumnStyle}
                          >
                            {col.name}
                          </TableHeaderColumn>
                        ))}
                      </tr>
                    </thead>
                  </table>
                  <div>
                    <ScrollRightWrapper>
                      <Table>
                        <TableBody
                          style={{backgroundColor: grey100}}
                          displayRowCheckbox={false}
                        >
                          {availableList !== undefined &&
                            availableList.length > 0
                            ? availableList.map(game => (
                              <TableRow
                                key={row++}
                                style={styles.tableRowStyle}
                                >
                                {gamesCols.map(col => (
                                  <TableRowColumn
                                    key={col.value}
                                    style={styles.tableRowColumnStyle}
                                    >
                                    {get(game, col.value)}
                                  </TableRowColumn>
                                  ))}
                              </TableRow>
                              ))
                            : <CircularProgress
                              size={60}
                              thickness={5}
                              color='#323765'
                              style={{paddingLeft: '45%', paddingTop: '3%'}}
                              />}
                        </TableBody>
                      </Table>
                    </ScrollRightWrapper>
                  </div>
                </div>
                {availableList && availableList.length > 0
                  ? <Toolbar>
                    <ToolbarGroup>
                      <span>
                        {/* {this.pageDetails(pageIndex, perPage, total)} */}
                      </span>
                    </ToolbarGroup>
                    <ToolbarGroup>
                      <RaisedButton
                        primary
                        label='Prev'
                        backgroundColor='#f5f5f5'
                        style={{marginRight: 5}}
                        labelColor='#323765'
                        icon={<ChevronLeft />}
                        labelPosition='after'
                        disabled={pageIndex === 0}
                        onMouseDown={() => {
                          this.getPreviousPageData()
                        }}
                        />
                      <RaisedButton
                        primary
                        label='Next'
                        icon={<ChevronRight />}
                        disabled={pageIndex === totalPages}
                        labelPosition='before'
                        onMouseDown={() => {
                          this.getNextPageData()
                        }}
                        />
                    </ToolbarGroup>
                  </Toolbar>
                  : null}
              </Card>
            </WrapperRight>
          </Wrapper>
        </Card>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  gameList: state.players.players,
  totalCount: state.players.totalCount,
  totalPages: state.players.totalPages,
  perPage: state.players.perPage,
  titles: state.players.availableTitles,
  filters: state.players.filters
})

const mapDispatchToProps = dispatch => ({
  fetchGameDetails: () => {
    dispatch(fetchGameDetails())
  },
  applyFilters: searchText => {
    dispatch(applyFilters(searchText))
  },
  resetSearchArray: () => {
    dispatch(resetSearchArray())
  },
  filterAdd: value => {
    dispatch(filterAdd(value))
  },
  filterRemove: () => {
    dispatch(filterRemove())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(GameList)
