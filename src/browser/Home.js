import * as React from 'react';

import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import StarBorder from '@mui/icons-material/StarBorder'
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore'
import Checkbox from '@mui/material/Checkbox'
import Paper from '@mui/material/Paper'
import SearchInput from './SearchInput'
import SearchMenu from './SearchMenu'

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Home() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true)
  const [lettersWithAccounts, setLettersWithAccounts] = React.useState([])
  const [letterDrawersOpen, setLettersDrawersOpen] = React.useState({})
  const [selectedAccount, setSelectedAccount] = React.useState({})
  const [selectedAccountFull, setSelectedAccountFull] = React.useState({})
  const [searchResults, setSearchResults] = React.useState([])

  React.useEffect(async () => {



  }, [])

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  async function importDirectoryClicked() {
    try {
      const result = await nodeApp.selectDirectory()
      let letters = {}
      let lettersOpen = {}
      result.forEach(obj=>{
        let { name } = obj
        let firstLetter = name ? name[0].toUpperCase() : ""
        if (firstLetter) {
          if (!letters[firstLetter]) {
            letters[firstLetter] = []
            lettersOpen[firstLetter] = false
          }
          letters[firstLetter].push(obj)
        }
      })
      Object.keys(letters).forEach(letter=>{
        letters[letter] = letters[letter].sort((a,b)=>{
          return (a.name > b.name) ? -1 : (a.name < b.name ? -1 : 0)
        })
      })

      setLettersDrawersOpen(lettersOpen)
      setLettersWithAccounts(letters)
    } catch(err) {
      console.error(err)
    }
  }


  return (
    <Box sx={{ display: 'flex'}}>



      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {selectedAccount ? selectedAccount.name : "Please select an account"}
          </Typography>
          <SearchInput disabled={(Object.keys(lettersWithAccounts).length == 0)}
            onChange={async (e)=>{
              let { value } = e.target
              try {
                let resultsContainingStrings = await nodeApp.search(value)
                let results = resultsContainingStrings.map(rslt=>JSON.parse(rslt.target))
                setSearchResults(results)
              } catch(err) {
                console.error(err)
              }
            }}
            onKeyDown={async (e)=>{
              if(e.keyCode == 13) {
                if (searchResults.length > 0) {
                  try {
                    setSelectedAccount({name:searchResults[0].name,filename:searchResults[0].filename})
                    let selectedAccountFull = await nodeApp.getAccountFull(searchResults[0].filename)
                    setSelectedAccountFull(selectedAccountFull)
                  } catch(err) {
                    console.error(err)
                  }
                }
              }
            }}
          />
        </Toolbar>
      </AppBar>


      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Button variant="outlined" onClick={importDirectoryClicked}>
            Import Directory
          </Button>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {Object.keys(lettersWithAccounts).sort().map((letter,i)=>(
            <Box key={`LI_${letter}`}>
              <ListItemButton dense onClick={()=>{
                let copy = JSON.parse(JSON.stringify(letterDrawersOpen))
                copy[letter] = !copy[letter]
                setLettersDrawersOpen(copy)
              }}>
                <ListItemIcon>
                  {i % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={letter} />
                {letterDrawersOpen[letter] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={letterDrawersOpen[letter]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {lettersWithAccounts[letter].map((obj, j)=>(
                    <ListItemButton dense key={`LI_${obj.name}`} sx={{ pl: 4 }}
                    selected={selectedAccount.name == obj.name}
                    onClick={async ()=>{
                      setSelectedAccount(obj)
                      let selectedAccountFull = await nodeApp.getAccountFull(obj.filename)
                      setSelectedAccountFull(selectedAccountFull)
                    }}>
                      <ListItemIcon>
                        <StarBorder />
                      </ListItemIcon>
                      <ListItemText primary={obj.name} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
        <SearchMenu searchResults={searchResults} btnOnClick={async (name, filename)=>{
          try {
            setSelectedAccount({name:name,filename:filename})
            let selectedAccountFull = await nodeApp.getAccountFull(filename)
            setSelectedAccountFull(selectedAccountFull)
          } catch(err) {
            console.error(err)
          }
        }} />
        {(selectedAccountFull && (Object.keys(selectedAccount).length > 0)) &&
          <Box>
            <List>
              {Object.keys(selectedAccountFull).map((sectionTitle,i)=>{
                let section = selectedAccountFull[sectionTitle]
                let count = ""
                let objectKeysToCount = ["Contacts","Contacts Related to Entity","TCM Financial Accounts","Open Activities","Activity History"]
                if (objectKeysToCount.includes(sectionTitle)) {
                  count = " (" + Object.keys(section).length + ")"
                } else if (sectionTitle == "Activity History") {
                  count + " (" + section.length + ")"
                }


                return (
                  <MainSection title={sectionTitle+count} startShow={i==0} key={`HH_Det_${i}`}>
                    {Object.keys(section).filter(ki=>ki!="accessDate").map((subsectionTitle,j)=>{
                      let subsection = section[subsectionTitle]


                      return (
                        <Paper key={`${sectionTitle}_${subsectionTitle}_${j}`} style={{flexDirection:"row",padding:'1rem',marginTop:8}}>
                          {((i == 0) || (i==5)) ?
                            <Box>
                              <h3>{i==5?parseInt(subsectionTitle)+1:subsectionTitle}</h3>
                              {Object.keys(subsection).filter(ki=>ki!="accessDate").map((finalKey,k)=>{
                                let finalValue = subsection[finalKey]
                                return <FinalElement title={finalKey} value={finalValue} key={`${sectionTitle}_${i}_${j}_${k}`} />
                              })}
                            </Box>
                            :
                            <CollapseWithTitle title={subsectionTitle}>
                              {Object.keys(subsection).filter(ki=>ki!="accessDate").map((finalKey,k)=>{
                                let finalValue = subsection[finalKey]

                                return (
                                  <Paper key={`${sectionTitle}_${i}_${j}_${k}`} style={{marginLeft:'1rem',padding:'1rem',marginTop:2,marginBottom:2}}>
                                    <h4>{finalKey}</h4>
                                    {Object.keys(finalValue).filter(ki=>ki!="accessDate").map((finalValueKey,m)=>{
                                      let finalValue2 = finalValue[finalValueKey]
                                      return (<FinalElement title={finalValueKey} value={finalValue2} key={`${sectionTitle}_${i}_${j}_${k}_${m}`} />)
                                    })}
                                  </Paper>
                                )
                              })}
                            </CollapseWithTitle>
                          }
                        </Paper>
                      )


                    })}
                    <div style={{height:12}} />
                  </MainSection>
                )

              })}
            </List>
          </Box>
        }
      </Main>

    </Box>
  )
}

//{selectedAccountFull["Household Detail"]}

function MainSection({title, children, startShow = false}) {

  const [show, setShow] = React.useState(startShow)

  return (
    <Paper style={{backgroundColor:'rgb(240,240,240)'}} elevation={4}>
      <ListItemButton onClick={()=>{
        setShow(!show)
      }}>
        <h2 style={{marginRight:4}}>{title}</h2>
        {show ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={show} style={{paddingLeft:'2rem',paddingRight:'2rem'}}>
        {children}
      </Collapse>
    </Paper>
  )
}

function FinalElement({title, value}) {

  return (
    <Box style={{marginLeft:'1rem'}}>
    {(typeof value == "boolean") ?
      <>
        <span><b>{title}: </b></span>
        <span style={{position:"relative",top:-8}}>
          <Checkbox checked={value} size="small" style={{position:"absolute"}}/>
        </span>
      </>
      :
      <>
        <span><b>{title}: </b></span>
        <span>{value}</span>
      </>
    }
    </Box>
  )
}

function CollapseWithTitle({title, children}) {
  const [show, setShow] = React.useState(false)
  return (
    <Paper style={{backgroundColor:"rgb(250,250,250)"}}>
      <ListItemButton dense onClick={()=>{
        setShow(!show)
      }}>
        <Typography variant="h6" noWrap component="div">
          {title}
        </Typography>
        {show ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={show}>
        {children}
      </Collapse>
    </Paper>
  )
}
/* 7674 for 2021
475+592+675+361+864+427+420+700+952+545+520+843 = 7374
Estimate 200 for Google Play
Estimate 100 for Ads
*/
