import {
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import { Store } from '../../Utils/Store';
import NextLink from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import CheckoutWizard from '../../components/CheckoutWizard';
// import { useSnackbar } from 'notistack';
import { useContext, useEffect, useReducer } from 'react';
import { getError } from '../../Utils/error';
// import Cookies from 'js-cookie';
import UseStyles from '../../Utils/styles';

function reducer(state, action) {
  // switch (action.type) {
  //   case 'FETCH_REQUEST':
  //     return { ...state, loading: true, error: '' };
  //   case 'FETCH_SUCCESS':
  //     return { ...state, loading: false, order: action.payload, error: '' };
  //   case 'FETCH_FAIL':
  //     return { ...state, loading: false, error: action.payload };
  // }\
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    // case 'PAY_REQUEST':
    //   return { ...state, loadingPay: true };
    // case 'PAY_SUCCESS':
    //   return { ...state, loadingPay: false, successPay: true };
    // case 'PAY_FAIL':
    //   return { ...state, loadingPay: false, errorPay: action.payload };
    // case 'PAY_RESET':
    //   return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    // case 'DELIVER_REQUEST':
    //   return { ...state, loadingDeliver: true };
    // case 'DELIVER_SUCCESS':
    //   return { ...state, loadingDeliver: false, successDeliver: true };
    // case 'DELIVER_FAIL':
    //   return { ...state, loadingDeliver: false, errorDeliver: action.payload };

    default:
      state;
  }
}

function Order({ params }) {
  const orderId = params.id;
  const classes = UseStyles;
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order]);

  // const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  return (
    <Layout title={`Order ${orderId}`}>
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <Typography component='h1' variant='h1'>
        Order {orderId}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography className={classes.error}> {error}</Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component='h2' variant='h2'>
                    Shipping Address
                  </Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress.fullName}, {shippingAddress.address}
                  {shippingAddress.city}, {shippingAddress.postalCode}
                  {shippingAddress.country}
                </ListItem>
                <ListItem>
                  status:
                  {isDelivered
                    ? `delivered at ${deliveredAt}`
                    : `not delivered`}
                  {shippingAddress.fullName}, {shippingAddress.address}
                  {shippingAddress.city}, {shippingAddress.postalCode}
                  {shippingAddress.country}
                </ListItem>
              </List>
            </Card>

            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component='h2' variant='h2'>
                    payment Method
                  </Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>
                <ListItem>
                  status:{isPaid ? `paid at ${paidAt}` : `not paid`}
                  {shippingAddress.fullName}, {shippingAddress.address}
                  {shippingAddress.city}, {shippingAddress.postalCode}
                  {shippingAddress.country}
                </ListItem>
              </List>
            </Card>

            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component='h2' variant='h2'>
                    Order Items
                  </Typography>
                </ListItem>

                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align='right'>Quantity</TableCell>
                        <TableCell align='right'>Price</TableCell>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <NextLink href={`/product/${item.slug}`} passHref>
                                <Link>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                  ></Image>
                                </Link>
                              </NextLink>
                            </TableCell>

                            <TableCell>
                              <NextLink href={`/product/${item.slug}`} passHref>
                                <Link>
                                  <Typography>{item.name}</Typography>
                                </Link>
                              </NextLink>
                            </TableCell>

                            <TableCell align='right'>
                              <Typography>{item.quantity}</Typography>
                            </TableCell>
                            <TableCell align='right'>
                              <Typography> ${item.price}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant='h2'>Order summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>items: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'> ${itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'> ${taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'> ${shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total:</strong>{' '}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>
                        <strong>${totalPrice} </strong>{' '}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { params } };
}
export default dynamic(() => Promise.resolve(Order), { ssr: false });
