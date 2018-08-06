import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Checkbox, TableBody, TableCell, TableRow } from '@material-ui/core';

const getSorting = (order, orderBy) =>
  order === 'desc'
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);

const TableBodyCmp = props => {
  const { words, order, orderBy, page, rowsPerPage, emptyRows, isSelected, handleClick, screenWidth } = props;

  return (
    <TableBody>
      {words
        .sort(getSorting(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map(word => {
          const { en, ru, transcription, examples, dateCreated, _id } = word;
          const isSelectedCurrent = isSelected(_id);

          return (
            <TableRow
              hover
              onClick={event => handleClick(event, _id)}
              role="checkbox"
              aria-checked={isSelectedCurrent}
              tabIndex={-1}
              key={_id}
              selected={isSelectedCurrent}
            >
              <TableCell padding="checkbox"><Checkbox checked={isSelectedCurrent}/></TableCell>
              <TableCell component="th" scope="row">{ru || '-'}</TableCell>
              <TableCell>{en || '-'}</TableCell>
              <TableCell>{transcription || '-'}</TableCell>
              {screenWidth > 800 && <TableCell>{examples ? examples[0] : '-'}</TableCell>}
              <TableCell>{moment(dateCreated)
                .isSame(moment(), 'day')
                ? `Today at ${moment(dateCreated)
                  .format('hh:mm:ss a') }`
                : moment(dateCreated)
                .format('DD.MM.YY, hh:mm a') || '-'}</TableCell>
            </TableRow>
          );
        })}
      {emptyRows > 0 && (
        <TableRow style={{ height: 49 * emptyRows }}>
          <TableCell colSpan={6}/>
        </TableRow>
      )}
    </TableBody>
  );
};

TableBodyCmp.propTypes = {
  words: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/forbid-prop-types
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  emptyRows: PropTypes.number.isRequired,
  isSelected: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  screenWidth: PropTypes.number,
};

TableBodyCmp.defaultProps = {
  words: [],
  screenWidth: null,
};

export default TableBodyCmp;
