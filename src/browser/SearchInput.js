import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function SearchInput({onChange, onKeyDown, disabled}) {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        disabled={disabled}
        placeholder="Search..."
        inputProps={{ 'aria-label': 'search' }}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </Search>
  )
}

/*
async function sharepointChangeDirNames(oldDirectory = "Tradewinds Documents", newDirectory = "Pacific Sage Partners Documents") {
  // paste contents into browser first on sharepoint site.
  // https://cdn.jsdelivr.net/npm/sharepointplus/browser/sharepointplus.js
  try {
    let documentsList = $SP().list("Documents")
    let resp = await documentsList.get({
      json:true,
      folderOptions:{
        path:"",
        show:"FilesAndFolders_Recursive"
      }
    })
    resp=resp.filter(item=>item.ContentType=="Folder")
    console.log(`${resp.filter(item=>item.FileLeafRef.toUpperCase().includes("TRADEWINDS")).length} case insensitive TRADEWINDS folders`)
    resp = resp.filter(item=>item.FileLeafRef.includes(oldDirectory))
    console.log(`${resp.length} case sensitive to change`)

    let updateResponse = await $SP().list("Documents").update(resp.map(item=>{
      return {
        ID:item.ID,
        Title:newDirectory,
        FileLeafRef:item.FileLeafRef.replace(oldDirectory, newDirectory),
        FileRef:item.FileRef.replace(oldDirectory, newDirectory),
        BaseName:newDirectory,
        EncodedAbsUrl:item.EncodedAbsUrl.replace(encodeURIComponent(oldDirectory), encodeURIComponent(newDirectory)),
        LinkFilename: newDirectory,
        LinkFilename2: newDirectory,
        LinkFilenameNoMenu: newDirectory,
        ServerUrl:item.ServerUrl.replace(oldDirectory, newDirectory),
        _EditMenuTableStart:newDirectory,
      }
    }))

    console.log(updateResponse)
  } catch(err) {
    console.error(err)
  }
}
sharepointChangeDirNames()
*/
