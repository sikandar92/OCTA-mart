import React, { useContext } from 'react';

import Layout from '../../components/Layout';
import NextLink from 'next/link';
import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import UseStyles from '../../Utils/styles';
import Image from 'next/image';
import db from '../../Utils/db';
import Product from '../../components/models/Product';
import axios from 'axios';
import { Store } from '../../Utils/Store';
import { useRouter } from 'next/router';

export default function ProductScreen(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const { product } = props;
  const classes = UseStyles();
  if (!product) {
    return <div>Product Not Found...</div>;
  }

  const addToCartHandler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock <= 0) {
      window.alert('Sorry.product is out of stock');
      return;
    }
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (data.countInStock < quantity) {
      window.alert('Sorry.product is out of stock');
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href='/' passHref>
          <Link>
            <Typography>back to products</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout='responsive'
          ></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component='h1' variant='h1'>
                {product.name}
              </Typography>
            </ListItem>

            <ListItem>
              <Typography>Category:{product.category}</Typography>
            </ListItem>

            <ListItem>
              <Typography>Brand:{product.brand}</Typography>
            </ListItem>

            <ListItem>
              <Typography>
                Rating:{product.rating}stars({product.numReviews}reaviews)
              </Typography>
            </ListItem>
            <ListItem>
              Descripition:<Typography>{product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant='contained'
                  color='primary'
                  onClick={addToCartHandler}
                >
                  Add to Cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
