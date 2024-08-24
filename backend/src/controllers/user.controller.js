const { ApiErrors } = require("../utils/ApiErrors");
const { ApiResponse } = require("../utils/ApiResponse");
const User = require("../models/user.model");
const https = require('https');
const fs = require('fs');
const { PTEORDACTYL_URL, PTEORDACTYL_KEY } = process.env;
const {
  createPteroUser,
  deletePteroUser,
  getPteroUser: getPU,
  updatePteroUser,
} = require("../utils/PteroUser");
const { createPteroServer } = require("../utils/PteroServer");
let registerMailTemplate = require("../template/html/register.js");

const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const Server = require("../models/server.model.js");
const { uploadCloudinary } = require("../utils/cloudinary.js");
const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge:  10 * 24 * 60 * 60 * 1000 // 10 days
};

const registerUser = async (req, res) => {
  // Steps to register a user
  // 1. Get the user data from the request body
  // 2. Validate the user data
  // 3. Check if the user already exists
  // 4. Check for avatar and upload it to cloudinary
  // 5. Hash the password
  // 6. Save the user to the database
  // 7. remove the password from the response
  // 8. Check for user creation
  // 9. Create the user in pterodactyl also
  // 10. Send a response

  try {
    // Get the user data from the request body
    const { firstName, lastName, email, username, password } = req.body;
    //console.log(req.body);
    // Validate the user data
    if ([firstName, lastName, email, username, password].includes(undefined)) {
      throw new ApiErrors(400, "All fields are required");
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiErrors(400, "User already exists");
    }
    // Create a Ptero user
    const [pteroUser, pteroerror] = await createPteroUser(
      email,
      firstName,
      lastName,
      username
    );
    if (pteroerror) {
      
      throw new ApiErrors(500, "Pterodactyl user not created");
    }

    // Create a new user

    const user = await User.create({
      firstName,
      lastName,
      email,
      username: username.toLowerCase(),
      password,
      pteroId: pteroUser.id,
      IP: req.ip,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      // delete ptero user
      await deletePteroUser(pteroUser.id);
      throw new ApiErrors(500, "User not created");
    }
    // send email
    registerMailTemplate = registerMailTemplate.replace(
      "{{username}}",
      username
    );

    // make a post req to /api/v1/mail
    const mailResponse = await axios.post("https://localhost:5000/api/v1/mail", {
      to: email,
      subject: "Welcome to How2MC GSM",
      body: registerMailTemplate,
    },{
      httpAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

      //console.log(mailResponse.data.success);
   const simplifiedMailResponse = mailResponse.data
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { createdUser, simplifiedMailResponse },
          "User created successfully and mail sent"
        )
      );
  } catch (error) {
    console.error(error.message);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshTOken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiErrors(500, "Token generation failed", error);
  }
};

const loginUser = async (req, res) => {
  try {
    // Steps to login a user
    // 1. Get the user data from the request body
    // 2. Validate the user data
    // 3. Check if the user exists
    // 4. Check if the password is correct
    // 5. Generate access token, refresh token and save the refresh token
    // send cookie
    // 6. Send a response

    // Get the user data from the request body
    const { email, password } = req.body;
    if ([email, password].includes(undefined)) {
      throw new ApiErrors(400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiErrors(404, "User not found");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new ApiErrors(400, "Invalid credentials");
    }

    // Generate access token, refresh token and save the refresh token
    const { accessToken, refreshToken } = await generateTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { refreshToken: "" },
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiErrors(400, "Refresh token not found");
    }
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiErrors(404, "User not found for the token");
    }
    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiErrors(400, "Invalid refresh token");
    }
    const { accessToken, newRefreshToken } = await generateTokens(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    console.log(error.message);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const getUser = async (req, res) => {
  const {accessToken} = req.cookies;
  try {
    if (!accessToken) {
      throw new ApiErrors(400, "Access token not found");
    }
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    if (!user) {
      throw new ApiErrors(404, "User not found for the token");
    }
    //console.log(user);
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User found"));
  
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
}

const getPteroUser = async (req, res) => {
  try {
    const [pteroUser, pteroError] = await getPU(req.user.pteroId);
    if (pteroError) {
      throw new ApiErrors(500, "Pterodactyl user not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, pteroUser, "Pterodactyl user found"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const createServer = async (req, res) => {
  try {
    const {
      name,
      eggInfo,
      docker_image,
      startup,
      limits,
      environment,
      feature_limits,
      allocation,
      deploy,
    } = req.body;
    const user = req.user.pteroId;
    //console.log(req.user.pteroId);
    const [pteroServer, pteroError] = await createPteroServer({
      name,
      user,
      eggInfo,
      docker_image,
      startup,
      limits,
      environment,
      feature_limits,
      allocation,
      deploy,
    });
    if (pteroError) {
      throw new ApiErrors(500, "Pterodactyl server not created");
    }
    return res
      .status(201)
      .json(new ApiResponse(200, pteroServer, "Pterodactyl server created"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
};

const getLimits = async (req, res) => {

  const userId = req.user.pteroId;
  try {
    const matchedUser = await Server.find({
      $and:[
        {user_id: userId},
        {"serverInfo.status" : "free"}
      ]
    }) 
    let limits =[]
    matchedUser.map(server => {
      limits.push(
        {
          cpu:server.serverInfo.cpu,
          ram:server.serverInfo.ram,
          disk:server.serverInfo.disk,
          backup:server.serverInfo.backups,
          database:server.serverInfo.databases,
          ports:server.serverInfo.ports
        }
      )
    })
    //console.log(limits)
    
    return res
      .status(200)
      .json(new ApiResponse(200, limits, "Pterodactyl server limits matched"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
}

const reloadJWT = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    //console.log('TOken',refreshToken); 
    if (!refreshToken) {
      throw new ApiErrors(400, "Refresh token not found");
    }
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiErrors(404, "User not found for the token");
    }
    const { accessToken, newRefreshToken } = await generateTokens(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );

  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res
      .status(200)
      .json(new ApiResponse(200, users, "All users fetched"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
}

const getUserInformationById = async (req, res) => {
  try {
    // //console.log(req.params.id);
    const user = await User.findById(req.params.id).select("-password -refreshToken");
    if (!user) {
      throw new ApiErrors(404, "User not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User found"));
 

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
}

const updateUser = async (req, res) => {
  try {
    const {user_id, firstName, lastName, email, username, password,
      isAdmin, coins, pteroId, avatar, role, IP,


    } = req.body;
    if(!user_id){
      throw new ApiErrors(400, "User id not found");
    }
    const user = await User.findById(user_id);
    if (!user) {
      throw new ApiErrors(404, "User not found");
    }
    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (email) {
      user.email = email;
    }
    if (username) {
      user.username = username;
    }
    if (password) {
      user.password = password;
    }
    if (isAdmin) {
      //console.log(isAdmin);
      user.isAdmin = isAdmin;
    }
    if (coins) {
      user.coins = coins;
    }

    if (avatar) {
      user.avatar = avatar;
    }
    if (role) {
      user.role = role;
    }
    if (IP) {
      user.IP = IP;
    }

    if(user.username || user.email || user.firstName || user.lastName){
      const body = {
        "email": user.email,
        "username": user.username,
        "first_name": user.firstName,
        "last_name": user.lastName,
      }
      const apiURL = `${PTEORDACTYL_URL}/api/application`;
      
      const pteroRes = await axios.patch(`${apiURL}/users/${pteroId}`, body, {
        headers: {
          Authorization: `Bearer ${PTEORDACTYL_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      
    }

    await user.save({
      validateBeforeSave: true,

    });
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  } catch (error) {
    //console.log(error.message)
    //console.log(error.response.data)
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(error.statusCode, error.data, error.message, error)
      );
  }
}

const updateTheImage = async (req, res) => {
  try {
    const {user_id} = req.body;
    const user = await User.findById(user_id);
    if (!user) {
      throw new ApiErrors(404, "User not found");
    }
    //console.log(req.file);
    const {path} = req.file;
    //console.log(path);
    const url = await uploadCloudinary(path);
    //console.log(url);
    

    user.avatar = url;
    await user.save({
      validateBeforeSave: false,
    });
    fs.unlinkSync(path);
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  } catch (error) {
    //console.log(error.message);
    res
      .status(error.statusCode || 500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal server error"
        )
      );
  }
}

module.exports = {
  updateTheImage,
  getUserInformationById,
  getAllUsers,
  reloadJWT,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getPteroUser,
  createServer,
  getUser,
  getLimits,
  updateUser
};
