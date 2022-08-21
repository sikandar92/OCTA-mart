import nc from 'next-connect';
import Product from '../../../components/models/Product';
import db from '../../../Utils/db';

const handler = nc();
handler.get(async (req, res) => {
  await db.connect();
  const Products = await Product.find({});
  await db.disconnect();
  res.send(Products);
});

export default handler;
