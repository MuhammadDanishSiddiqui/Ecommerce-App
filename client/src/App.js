import './App.css';
import { useEffect } from "react"
import Navbar from "./components/Navbar"
import { getUserProfile } from "./config/redux/actions/userActions"
import { useDispatch } from "react-redux"
import Routes from "./config/Routess"
import axios from 'axios';


function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token")
      dispatch(getUserProfile())
    }
  }, [dispatch])

  return (

    <>
      <Navbar />
      <Routes />
    </>
  );
}

export default App;
