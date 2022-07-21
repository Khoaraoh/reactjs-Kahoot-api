import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import randomstring from 'randomstring';
import { userModel } from '../models/schema/user.schema.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const {email, password} = req.body;
  const user = await userModel.findOne({email});
  if(user){
    return res.status(400).json({
      msg: "Email has already exists"
    })
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({email, password: hashPassword});
  return res.status(200).json({
    msg: "Create account successfully",
    newUser
  })
})

router.post("/login", async (req,res) => {
  const {email, password} = req.body;
  const user = await userModel.findOne({email});
  if(!user){
    res.status(401).json({
      authenticated: false
    })
  }
  if (bcrypt.compareSync(password, user.password) === false) {
    return res.status(401).json({
      authenticated: false
    });
  }

  const payload = {
    userId: user._id,
  }

  const opts = {
    expiresIn: 10 * 60 // seconds
  }

  const accessToken = jwt.sign(payload, 'SECRET_KEY', opts);
  const refreshToken = randomstring.generate(80);

  await userModel.findByIdAndUpdate(user._id, {rfToken: refreshToken});
  res.status(200).json({
    authenticated: true,
    accessToken,
    refreshToken
  })

})

export default router;