import nc from 'next-connect';
import User from '../../../components/models/User';
import db from '../../../Utils/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../Utils/auth';

const handler = nc();
handler.post(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });
  await db.disconnect();
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user);
    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).send({ message: 'Invalid email or password' });
  }
});

export default handler;
