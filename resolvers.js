const db = require("./db");
const usersData = require("./data/users.json");
const productsData = require("./data/products.json");
const { validateRegisterInput, validateLoginInput } = require("./validators");
const { UserInputError } = require("apollo-server");
const Query = {
  userProfile: (root, args, context, info) => {
    return db.users.get(args.id);
  },
  oneProductData: (root, args, context, info)=>{
    return (db.products.get(args.id));
  },
  allProductsData: ()=>{
    return productsData;
  }
};
const Mutation = {
  userRegister: (root, args, context, info) => {
    const { valid, errors } = validateRegisterInput(
        args.firstName,
        args.lastName,
        args.phoneNumber,
        args.email,
        args.password
    );
    if (!valid) {
      throw new UserInputError("Errors", { errors });
    }
    const user = usersData.filter((item) => item.email === args.email);
    if (user.length > 0) {
      throw new UserInputError("user with this email exist", {
        errors: {
          email: "A User with this Email is already exist",
        },
      });
    } else {
      const id = db.users.create({
        firstName: args.firstName,
        lastName: args.lastName,
        phoneNumber: args.phoneNumber,
        email: args.email,
        password: args.password,
      });
      return db.users.get(id);
    }
  },
  userLogin: (root, {email, password}, context, info)=>{
    const { errors, valid } = validateLoginInput(email, password);

    if (!valid) {
      throw new UserInputError('Errors', { errors });
    }

    const user = usersData.filter((item) => item.email === email)

    if (user.length === 0) {
      errors.general = 'User not found';
      throw new UserInputError('User not found', { errors });
    }

    if (password !== user[0].password) {
      errors.general = 'Wrong crendetials';
      throw new UserInputError('Wrong crendetials', { errors });
    }

    return db.users.get(user[0].id);
  }
};
const User = {
  fullName: (root, args, context, info) => {
    return root.firstName + " " + root.lastName;
  }, 
};


module.exports = { Query, User, Mutation};
