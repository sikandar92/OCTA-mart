import nc from 'next-connect';
import Product from '../../components/models/Product';
import User from '../../components/models/User';
import data from '../../Utils/data';
import db from '../../Utils/db';

const handler = nc();
handler.get(async (req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);

  await Product.deleteMany();
  await Product.insertMany(data.products);

  await db.disconnect();
  res.send({ message: 'seed successfully' });
});

export default handler;
