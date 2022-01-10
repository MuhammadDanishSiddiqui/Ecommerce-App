import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import pic from "../avatar.png"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import axios from "axios"
import { useNavigate } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        fontSize: "30px",
        fontStyle: "oblique"
    },
    toolbox: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
            "& .MuiTypography-root": {
                margin: "10px 0",
            }
        }
    }
}));

export default function ButtonAppBar() {
    const navigate = useNavigate()
    const classes = useStyles();
    const { user, isAuth } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <div className={classes.root}>
            <AppBar position="absolute">
                <Toolbar className={classes.toolbox}>
                    <div>
                        <Typography variant="h6" className={classes.title}>
                            Ecommerce
                     </Typography>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                        <Button component={Link} to="/" color="inherit">Home</Button>
                        <Button component={Link} to="/products" color="inherit">Products</Button>
                        <Button component={Link} to="/search" color="inherit">Search</Button>
                        {isAuth ? <Button component={Link} to="/cart" color="inherit">Cart</Button> : <Button component={Link} to="/register" color="inherit">Sign Up</Button>}
                        {isAuth ? <img alt="avatar" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} style={{ width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer" }} src={user.avatar && !user.avatar.url ? pic : user.avatar.url} /> : <Button component={Link} to="/login" color="inherit">Login</Button>}

                    </div>

                </Toolbar>
            </AppBar>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>Profile</MenuItem>
                {user.role === "admin" && <MenuItem component={Link} to="/admin/dashboard" onClick={handleClose}>Dashboard</MenuItem>}
                <MenuItem component={Link} to="/orders" onClick={handleClose}>My Orders</MenuItem>
                <MenuItem component={Link} to="/password/update" onClick={handleClose}>Change Password</MenuItem>
                <MenuItem onClick={async () => {
                    try {
                        const { data } = await axios({
                            method: "post",
                            url: "/api/user/logout"
                        })
                        localStorage.clear()
                        sessionStorage.clear()
                        axios.defaults.headers.common["Authorization"] = null
                        dispatch({ type: "USER_LOGOUT" })
                        handleClose()
                        alert(data.message)
                        navigate("/login")

                    } catch (error) {
                        if (error.response) {
                            handleClose()
                            alert(error.response.data.error)
                            return
                        }

                        handleClose()
                        alert(error)
                    }


                }}>Logout</MenuItem>
            </Menu>
        </div>
    );
}
