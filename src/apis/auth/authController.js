import UserModel from '../../models/User.js'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'

// user register
export const register = (req, res) => {
  UserModel
    .findOne({ email: req.body.email })
    .exec((err, user) => {
      if (user) {
        return res.status(400).json({
          error: "Email is already taken"
        })
      }

      const inputs = req.body

      let newUser = new UserModel(inputs)
      newUser.save((err, success) => {
        if (err) {
          return res.status(400).json({
            error: err
          })
        }

        res.json({
          message: "successfully registered!"
        })
      })
    })
}

export const signIn = (req, res) => {
  const { email, password } = req.body

  // existential check
  console.log('running...')
  UserModel
    .findOne({ email })
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: `email is not registered yet. Please register first!`
        })
      }

      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          error: "Email and password do not match!"
        })
      }

      // generate token and send it to client's browser
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      )

      res.cookie("token", token, { expiresIn: "1d" })

      const { _id, firstName, lastName, email, templates } = user
      return res.json({
        user: { _id, firstName, lastName, email, templates },
      });
    })
}

export const signOut = (req, res) => {
  res.clearCookie('token')
  res.json({
    message: "sign out successfully"
  })
}

export const requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: function (req) {
    if (req.cookies) {
      return req.cookies.token;
    } else {
      return null
    }
  }
})

export const authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  UserModel
    .findById({ _id: authUserId })
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: 'User not found',
        })
      }
      const {firstName, lastName, email, templates} = user
      req.profile = { firstName, lastName, email, ...(templates && {templates}) };
      res.header('Access-Control-Allow-Credentials', true)
      next()
    })
}

export const updateUser = async(req, res) => {
  const userId = req.user._id
  try {
    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    const inputs = req.body
    const updateInput = await UserModel.findByIdAndUpdate(userId,
      inputs,
      { new: true, omitUndefined: true })
    const { _id, firstName, lastName, email, templates } = updateInput;
    res.json({ user: _id, firstName, lastName, email, templates });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: 'Generic server error'
    })
  }
}

export const addTemplate = async(req, res) => {
  const userId = req.user._id
  try {
    const inputs = req.body
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: { templates: inputs },
      },
      { new: true, omitUndefined: true }
      )
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }
    const {_id, email, firstName, lastName, templates} = user
    res.json({ user: { _id, email, firstName, lastName, templates } });
  } catch (error) {
    res.status(500).json({
      error: 'Generic server error',
    });
  }
}

export const deleteTemplate = async (req, res) => {
  const {tempId} = req.params;
  const userId = req.user._id;
  try {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { templates: { _id: tempId } },
      },
      { new: true, omitUndefined: true }
    );
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }
    const { _id, email, firstName, lastName, templates } = user;
    res.json({ user: { _id, email, firstName, lastName, templates } });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: 'Generic server error',
    });
  }
};