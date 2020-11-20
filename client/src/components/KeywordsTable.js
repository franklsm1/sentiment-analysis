import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3)
  },
  selected: {
    backgroundColor: 'yellow'
  }
}));

function createData (id, keyword, status, createdDate) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(createdDate).toLocaleDateString('en-US', options);
  return { id, keyword, status, createdDate: formattedDate };
}

export default function KeywordsTable ({ setSelectedId, keywords, filterPosts }) {
  const [selected, setSelected] = useState(1);
  const classes = useStyles();
  const rows = keywords.map(({ id, value, status, created_date: createdDate }) => createData(id, value, status, createdDate));
  const isSelected = id => selected === id;
  const selectHandler = (row) => {
    setSelected(row);
    setSelectedId(row);
    filterPosts(row);
  };
  return (
    <Paper className={classes.root}>
      <div>
        <Typography style={{ paddingTop: '1rem' }} variant="h6">
          <strong>Select a keyword below</strong>
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Keyword</TableCell>
              <TableCell>Start Date</TableCell>
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
                  className={isSelected(row.id) && classes.selected}
                  key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.keyword}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <span>{row.createdDate}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
}
