import './App.css';
import { useEffect } from "react"
import Navbar from "./components/Navbar"
import { getUserProfile } from "./config/redux/actions/userActions"
import { useDispatch } from "react-redux"
import Routes from "./config/Routess"
import axios from 'axios';

if (localStorage.getItem("token")) {
  axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token")
}

axios.defaults.baseURL = `https://ecommerce-mern-stack-app.herokuapp.com`


function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUserProfile())
  }, [dispatch])

  return (

    <>
      <Navbar />
      <Routes />
    </>
  );
}

export default App;
