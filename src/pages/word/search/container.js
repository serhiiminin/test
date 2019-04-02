import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { parseSearch, mergeSearch } from 'url-joiner';
import uuid from 'uuid';
import { joinUrl } from 'url-joiner/dist/join-utils';
import { ControlsSeparator, TextFieldLoading, WordPreview } from '../../../components';
import loadingNames from '../../../constants/loading-names';
import routes from '../../../routes';
import wordShape from '../../../constants/shapes';

const StyledSearchBlock = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1em;
`;

const SEARCH_INPUT_TIMEOUT = 500;

class SearchWordContainer extends Component {
  static propTypes = {
    wordItem: wordShape(PropTypes),
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    saveWord: PropTypes.func.isRequired,
    searchWord: PropTypes.func.isRequired,
    cleanWord: PropTypes.func.isRequired,
    checkIsLoading: PropTypes.func.isRequired,
    setWordToState: PropTypes.func.isRequired,
  };

  static defaultProps = {
    wordItem: null,
  };

  state = {
    searchValue: '',
    isToEditMode: false,
  };

  componentDidMount() {
    const { location } = this.props;
    const searchParams = parseSearch(location.search);
    if (searchParams.query) {
      this.searchWord(searchParams.query);
    }
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const searchParams = parseSearch(location.search);

    if (location.search !== prevProps.location.search && searchParams.query) {
      this.searchWord(searchParams.query);
    }
  }

  componentWillUnmount() {
    const { cleanWord } = this.props;
    const { isToEditMode } = this.state;

    if (!isToEditMode) {
      cleanWord();
    }
  }

  cleanSearchValue = () => this.setState({ searchValue: '' });

  searchWord = word => {
    const { searchWord } = this.props;

    clearTimeout(this.inputTimer);
    this.setState({ searchValue: word });
    this.inputTimer = setTimeout(() => {
      searchWord({ word });
    }, SEARCH_INPUT_TIMEOUT);
  };

  handleOnChangeSearchInput = event => {
    clearTimeout(this.inputTimer);
    const { history } = this.props;
    const { value } = event.target;

    this.setState({ searchValue: value });

    this.inputTimer = setTimeout(() => {
      history.push(joinUrl(routes.words.search, mergeSearch({ query: value })));
    }, SEARCH_INPUT_TIMEOUT);
  };

  handleEditBeforeSaving = () => {
    const { history, setWordToState, wordItem } = this.props;
    this.setState(
      {
        isToEditMode: true,
        searchValue: '',
      },
      () => {
        setWordToState({ ...wordItem, _id: uuid() });
        history.push(routes.words.add);
      }
    );
  };

  handleSaveWord = () => {
    const { saveWord, wordItem, cleanWord } = this.props;

    return saveWord(wordItem).then(() => {
      this.cleanSearchValue();
      return cleanWord();
    });
  };

  render() {
    const { searchValue } = this.state;
    const { wordItem, checkIsLoading } = this.props;
    const isEmpty = !Object.keys(wordItem).length;
    const loading = checkIsLoading(loadingNames.words.search);

    return (
      <main>
        <h1>This is the dictionary of definitions</h1>
        <StyledSearchBlock>
          <TextFieldLoading
            label="Search a word"
            value={searchValue}
            onChange={this.handleOnChangeSearchInput}
            loading={loading}
          />
          <ControlsSeparator align="right">
            <Button onClick={this.handleSaveWord} disabled={isEmpty} variant="contained" color="primary">
              Save to my words
            </Button>
            <Button onClick={this.handleEditBeforeSaving} disabled={isEmpty} variant="contained" color="primary">
              Edit before saving
            </Button>
          </ControlsSeparator>
        </StyledSearchBlock>
        <WordPreview wordItem={wordItem} />
      </main>
    );
  }
}

export default SearchWordContainer;