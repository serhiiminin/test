import { variables } from '../../styles/variables';

const styles = {
  addWord: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    rowGap: '0.5rem',
    columnGap: '1rem',
  },
  linkToMyWords: {
    padding: `${variables.padding.medium} 0`,
  }
};

export default styles;
