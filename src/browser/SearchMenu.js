import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'

export default function SearchMenu({searchResults, btnOnClick}) {
  if (searchResults.length == 0) {
    return null
  }

  const pressEnter = ()=>{
    console.log('P!')
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Household</TableCell>
            <TableCell align="center">Owner</TableCell>
            <TableCell align="center">Inactive</TableCell>
            <TableCell align="center">Deceased</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchResults.map(({name, owner, inactive, deceased, filename}, i) => (
            <TableRow
              key={`SearchResult_${i}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
            >
              <TableCell component="th" scope="row">
                <Button size="small" variant={i==0?"contained":"text"} onClick={()=>{
                  btnOnClick(name, filename)
                }}>
                  {name}
                </Button>
              </TableCell>
              <TableCell align="center">{owner}</TableCell>
              <TableCell align="center">
                {inactive != "active" &&
                  <Checkbox disabled size="small" checked />
                }
              </TableCell>
              <TableCell align="center">
                {deceased == "deceased" &&
                  <Checkbox disabled size="small" checked />
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
