import User from "../model/user.js";
import Achievement from "../model/achievement.js";
import Message from "../model/message.js";
import Post from "../model/post.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "heal secret key", {
    expiresIn: maxAge,
  });
};

const defaultListOfAchievements = [
  Achievement({ count: 10, type: "step", countType: "K", isAchieved: false }),
  Achievement({ count: 20, type: "step", countType: "K", isAchieved: false }),
  Achievement({ count: 30, type: "step", countType: "K", isAchieved: false }),
  Achievement({ count: 50, type: "step", countType: "K", isAchieved: false }),
  Achievement({ count: 100, type: "step", countType: "K", isAchieved: false }),
  Achievement({ count: 500, type: "step", countType: "K", isAchieved: false }),
  Achievement({ count: 1, type: "step", countType: "MIl", isAchieved: false }),

  Achievement({
    count: 5,
    type: "distance",
    countType: "Km",
    isAchieved: false,
  }),
  Achievement({
    count: 10,
    type: "distance",
    countType: "Km",
    isAchieved: false,
  }),
  Achievement({
    count: 20,
    type: "distance",
    countType: "Km",
    isAchieved: false,
  }),
  Achievement({
    count: 50,
    type: "distance",
    countType: "Km",
    isAchieved: false,
  }),
  Achievement({
    count: 100,
    type: "distance",
    countType: "Km",
    isAchieved: false,
  }),
];

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "heal.client.assistant@gmail.com",
    pass: "uqpjbvdeoyuicdbe",
  },
});

export const register = async (req, res) => {
  let { username, email, password } = req.body;
  username = username.toLowerCase();
  email = email.toLowerCase();
  try {
    let userFields = {
      username,
      email,
      password,
      achievements: defaultListOfAchievements,
    };

    if (req.file) {
      userFields.image = req.file.filename;
    }
    const user = await User.create(userFields);
    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ token, ...user._doc });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();
  try {
    const user = await User.findOne({ email });
    if (user) {
      if (password == user.password) {
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ token, ...user._doc });
      } else {
        res.status(400).json({ message: "Password is incorrect" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const sendResetPasswordEmail = async (req, res) => {
  let email = req.body.email;
  email = email.toLowerCase();
  try {
    const user = await User.findOne({ email });
    if (user) {
      const resetCode = Math.floor(100000 + Math.random() * 900000);
      const mailOptions = {
        from: "Heal Support",
        to: email,
        subject: "Password Reset Request",
        text: `Your password reset code is ${resetCode}`,
        html: `<p>Your password reset code is <strong>${resetCode}</strong></p>`,
      };
      transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
          await User.findOneAndUpdate({ email }, { resetCode });
          res.status(200).json(true);
        }
      });
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const checkResetCode = async (req, res) => {
  let { email, resetCode } = req.body;
  email = email.toLowerCase();
  try {
    const user = await User.findOne({ email });
    if (user) {
      if (resetCode == user.resetCode) {
        res.status(200).json(true);
      } else {
        res.status(400).json({ message: "Reset code is incorrect" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.password = password;
      user.resetCode = null;
      await user.save();
      res.status(200).json(true);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

export const googleAuth = async (req, res) => {
  let { email, displayName,avatar } = req.body;

  displayName = displayName.split(" ");
  displayName =
    displayName[0] +
    displayName[1].charAt(0).toUpperCase() +
    displayName[1].slice(1);

  email = email.toLowerCase();

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ token, ...user._doc });
    } else {
      const newUser = await User.create({
        email: email,
        username: displayName,
        image: avatar,
        achievements: defaultListOfAchievements,
      });
      const token = createToken(newUser._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ token, ...newUser._doc });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const setPassword = async (req, res) => {
  let { password } = req.body;
  const token = req.headers['jwt']
  const user = req.user;
  try {
    user.password = password;
    console.log(user)
    await user.save();
    res.status(200).json({ token, ...user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json(true);
};

export const setUserLocation = async (req, res) => {
  const user = req.user;
  let { longitude, latitude } = req.body;
  try {
    user.longitude = longitude;
    user.latitude = latitude;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const findNearbyUsers = async (req, res) => {
  const user = req.user;
  try {
    const nearbyUsers = await User.find({
      _id: { $ne: user._id },
      longitude: { $ne: null },
      latitude: { $ne: null },
      hideLocation: {$ne: true},
    });
    res.status(200).json(nearbyUsers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updatePassword = async (req, res) => {
  const user = req.user;
  let { oldPassword, newPassword } = req.body;
  try {
    if (oldPassword == user.password) {
      user.password = newPassword;
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "Old password is incorrect" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateUsername = async (req, res) => {
  const user = req.user;
  let { username } = req.body;
  try {
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      res.status(400).json({ message: "Username already exists" });
    } else {
      user.username = username;
      await user.save();
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const addGoals = async (req, res) => {
  const user = req.user;
  let { steps, distance, calories } = req.body;
  try {
    user.steps = steps;
    user.distance = distance;
    user.calories = calories;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const addHealth = async (req, res) => {
  const user = req.user;
  let { age, weight, length } = req.body;
  try {
    user.age = age;
    user.weight = weight;
    user.length = length;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const hideLocation = async (req, res) => {
  const user = req.user;
  try {
    if (user.hideLocation == true) {
      user.hideLocation = false;
      await user.save();
      res.status(200).json(user);
    } else {
      user.hideLocation = true;
      await user.save();
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateAchievements = async (req, res) => {
  const user = req.user;
  const toUpdate = JSON.parse(req.body.achievements);
  const updatedAchievements = user.achievements.map((achievement) => {
    const matchingAchievement = toUpdate.find(
      (a) =>
        a.count === achievement.count && a.countType === achievement.countType
    );
    return matchingAchievement
      ? { ...achievement, isAchieved: true }
      : achievement;
  });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { achievements: updatedAchievements },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const addPost = async (req, res) => {
  const user = req.user;

  const username = req.body.username;
  const type = req.body.type;
  const count = req.body.count;
  const countType = req.body.countType;
  const currentDate = Date.now();

  try {
    const current = await Post.create({
      username: username,
      type: type,
      count: count,
      countType: countType,
      date: currentDate,
    });

    user.posts.push(current);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  const user = req.user;
  let id = req.body.id;
  try {
    user.posts = user.posts.filter((post) => post._id != id);
    await user.save();
    await Post.findByIdAndDelete(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUsersChattedWith = async (req)=>{
  const username = req.user.username;
  let listOfUsernames = [];
  const messages = await Message.find({ $or: [{ from: username }, { to: username }] });
  const usersChattedWith = messages.map((message) => {
    if (message.from == username) {
      listOfUsernames.push(message.to);
    } else {
      listOfUsernames.push(message.from);
    }
  });
  return listOfUsernames;
}

export const getAllUsers = async (req, res) => {
  let usersChattedWith = await getUsersChattedWith(req);
  try {
    const users = await User.find({ username: { $in: usersChattedWith } });
    res.status(200).json(users);
  }
  catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const username = req.user.username;
    const messagesFrom = req.query.dest;

    const last30 = await Message.find({
      $or: [
        { from: username, to: messagesFrom },
        { from: messagesFrom, to: username },
      ],
    })
      .sort({ createdAt: "asc" })
      .limit(30);

    res.status(200).json(last30);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

export const userConnected = async (uid = "") => {
  const user = await User.findById(uid);
  user.online = true;
  await user.save();
  return user;
};

export const userDisconnected = async (uid = "") => {
  const user = await User.findById(uid);
  user.online = false;
  user.lastSeen = Date.now();
  await user.save();
  return user;
};

export const saveMessage = async (payload) => {
  try {
    const message = new Message(payload);
    await message.save();
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
