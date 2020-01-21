import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3)
  }
}));

function createData (id, keyword, status) {
  return { id, keyword, status };
}

export default function KeywordsTable ({ setSelectedId, keywords, filterPosts }) {
  const [selected, setSelected] = useState(1);
  const classes = useStyles();
  const rows = keywords.map(({ id, value, status }) => createData(id, value, status));
  const isSelected = id => selected === id;
  const selectHandler = (row) => {
    console.log('row ->>>', row);
    setSelected(row);
    setSelectedId(row);
    filterPosts(row);
  };
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Keyword</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => {
            return (
              <TableRow onClick={() => selectHandler(row.id)}
                role={row.id}
                hover
                aria-checked={isSelected(row.id)}
                aria-label={row.keyword}
                selected={isSelected(row.id)}
                key={row.id}>
                <TableCell component="th" scope="row">
                  {row.keyword}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
