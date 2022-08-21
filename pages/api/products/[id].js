/* eslint-disable no-unused-vars */
// import nc from 'next-connect';
// import Product from '../../../components/models/Product';
// import db from '../../../Utils/db';

// const handler = nc();
// handler.get(async (req, res) => {
//   await db.connect();
//   const Product = await Product.findById(req.query.id);
//   await db.disconnect();
//   res.send(Product);
// });

// export default handler;

import nc from 'next-connect';
import db from '../../../Utils/db';
import Product from '../../../components/models/Product';
const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const prod = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(prod);
});

export default handler;
