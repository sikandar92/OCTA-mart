import nc from 'next-connect';
import User from '../../../components/models/user';
import db from '../../../Utils/db';

const handler = nc();
handler.post(async (req, res) => {
  await db.connect();
  const Products = await User.findOne({ email: req.body.email });
  await db.disconnect();
  res.send(Products);
});

export default handler;
