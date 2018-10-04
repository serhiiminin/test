import React, { Component } from 'react';
import { TextField } from '../../components-mui';
import { MultipleInputs } from "..";


class WordForm extends Component {
  state = {
    word: {
      en: '',
      ua: '',
      transcription: '',
      examples: [],
    }
  };

  static getDerivedStateFromProps = (nextProps, prevState) =>
    prevState.word && prevState.word._id !== nextProps.word._id
      ? { word: nextProps.word }
      : null;

  handleFieldChange = newData => this.setState(prevState => ({
    word: { ...prevState.word, ...newData }
  }));

  render() {
    const { word } = this.state;
    const { en, ua, transcription, examples } = word;

    return (
      <form>
        <TextField
          label="English"
          value={en}
          onChange={({ target }) => this.handleFieldChange({ 'en': target.value })}
        />
        <TextField
          label="Ukrainian"
          value={ua}
          onChange={({ target }) => this.handleFieldChange({ 'ua': target.value })}
        />
        <TextField
          label="Transcription"
          value={transcription}
          onChange={({ target }) => this.handleFieldChange({ 'transcription': target.value })}
        />
        <MultipleInputs
          items={examples}
          label='Example'
          blockTitle='Examples'
        />
      </form>
    );
  }
}

export default WordForm;