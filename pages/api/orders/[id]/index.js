import nc from 'next-connect';
import db from '../../../../Utils/db';
import Order from '../../../../components/models/Order';
import { isAuth } from '../../../../Utils/auth';

const handler = nc();
handler.use = isAuth;
handler.get(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  await db.disconnect();
  res.send(order);
});

export default handler;
