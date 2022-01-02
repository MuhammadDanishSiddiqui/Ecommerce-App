import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
    search_box: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "90vh",
        "& input": {
            padding: "10px",
            width: "45%",
            border: "1px solid black",
            outline: "none",
            fontSize: "20px"
        },
        "& button": {
            padding: "10px",
            border: "1px solid black",
            outline: "none",
            fontSize: "20px",
            backgroundColor: "green",
            color: "white",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "blue"
            }
        },
        [theme.breakpoints.down("sm")]: {
            "& input": {
                width: "60%",

            },
        }
    },
}));



const Search = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState()
    function submitHandler(e) {
        e.preventDefault()
        if (keyword) {
            navigate(`/products/${keyword}`);
        }
        else {
            navigate('/products');
        }

    }

    return (
        <form className={classes.search_box} onSubmit={submitHandler}>
            <input type="text" value={keyword} placeholder="search your products..." onChange={e => setKeyword(e.target.value)} />
            <button type="submit">Search</button>
        </form>

    )
}

export default Search
