import React from 'react'
import {
    Link
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Rating } from "@material-ui/lab"


const useStyles = makeStyles(theme => ({
    root: {
        flexBasis: "20%",
        margin: "10px",
        [theme.breakpoints.down("sm")]: {
            flexBasis: "40%"
        },
        [theme.breakpoints.down("xs")]: {
            flexBasis: "80%"
        }
    },
}));


function Product({ product }) {

    const options = {
        value: product.ratings,
        readOnly: true,
        precision: 0.5
    }


    const classes = useStyles();
    return (
        <Grid component={Link} to={`/product/${product._id}`} className={`${classes.root}`} style={{ marginBottom: "20px", textDecoration: "none", color: "black" }}>
            <CardActionArea>
                <CardMedia
                    image={product.images[0].url}
                    title={product.name}
                    alt={product.name}
                    component="img"
                    height="170"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {product.name}
                    </Typography>
                    <div className="rating">
                        <Rating {...options} /><span>({product.numOfReviews} Reviews)</span>

                    </div>
                    <Typography variant="h5" component="h2">
                        ${product.price}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions style={{ textAlign: "center", backgroundColor: "blue", cursor: "pointer" }}>
                <div style={{ width: "100%" }}>
                    <Button size="small" style={{ color: "white" }}>
                        View
                  </Button>
                </div>
            </CardActions>
        </Grid>

    )
}

export default Product
