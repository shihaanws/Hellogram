import React,  {useState, useEffect}  from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  
} from "react-router-dom";import Post from './Post.js';
import {db , auth} from './firebase.js';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button,Input} from '@material-ui/core';
import ImageUpload from './ImageUpload';
import SignUpPage from "./SignUpPage";
//import firebase from 'firebase';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,

    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open , setOpen] = useState(false);
  const [openSignIn , setOpenSignIn] = useState(false);
  const [email , setEmail] = useState('');
  const [username , setUsername] = useState('');
  const [password , setPassword] = useState('');
  const [user , setUser] = useState(null);

  useEffect(() => {
    const unsubscribe= auth.onAuthStateChanged((authUser) => {
      if(authUser){
        console.log(authUser);  
        setUser(authUser);
        if(authUser.displayName){

        }else{
          return authUser.updateProfile({
            displayName: username,
          });
        }
      }else{
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  },[user , username]);
   useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map(doc=>({
          id: doc.id,
          post : doc.data()
        })
      ));
    })
  }, []);

  const signUp = async (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email , password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email , password)
    
    .catch((error) => alert(error.message));
    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Router>
      <Switch>
        <Route exact path="/signup" >
           <SignUpPage/>
        </Route>
      
      
      <Route exact path="/">
      <Modal
        open={open}
        onClose={()=> setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
        <form className = "app__signUp">
        <center>
          <img className="app__headerimage" alt="abc" src="https://img.icons8.com/bubbles/2x/stack-of-photos.png"></img>
         </center>
          <Input
          type='text'
          placeholder='username'
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          />
          <Input
          type='email'
          placeholder='email'
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
          <Input
          type='password'
          placeholder='password'
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          />
          <Button type="submit"  style={{color:"white"}} onClick={signUp}>Sign Up</Button>
        
          </form>
        </div>
      
      </Modal>
      <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className = "app__signUp">
        <center>
          <img className="app__headerimage" alt="abc" src="https://img.icons8.com/bubbles/2x/stack-of-photos.png"></img>
         </center>
          <Input
          type='email'
          placeholder='email'
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
          <Input
          type='password'
          placeholder='password'
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          />
          <Button type="submit" style={{color:"white"}}  onClick={signIn}>Sign In</Button>
        
          </form>
        </div>
      
      </Modal>
         <div className="app__header">
           <div className="logosection">
         <img className="app__headerImage" 
           src="https://img.icons8.com/bubbles/2x/stack-of-photos.png"
           alt=""
       />
                  <p>Hellogram</p>

           </div>
          
        
          {user ? (
        <Button variant="contained" onClick ={()=>auth.signOut()}>Logout</Button>
        ): (
        <div className = "app__loginContainer">
          <div className="cusbutton">
          <Button  variant="contained" onClick ={()=>setOpen(true)}>Sign Up</Button>

          </div>
        <div className="cusbutton1">
          <Button  variant="contained" color="primary" onClick ={()=>setOpenSignIn(true)}>Sign In</Button>
        </div>
        </div>
      )}
      </div>
      
      <div className= 'app__posts'>

            {posts.map( ({id , post})  => (
              <Post
                key = {id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imgUrl={post.imgUrl}
              />
            ))}
          </div>
          

      {user?.displayName ? (

        <div className="please__signin">
            <ImageUpload  username= {user.displayName} />
        </div>

      ):(
      
      <p className="please__signin">Upload Images? You need to sign in first !</p>
      )}

    
      </Route>
      </Switch>
      </Router>
      </div>

  );
}
export default App;
