const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Meal = require('./models/meal');
const User = require('./models/user');

const app = express();
const port = 4000;
const host = 'localhost';

//connection config to mongo atlas
const conConfig = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster-some-fit-app-xify8.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

app.use(bodyParser.json());

const mySchema = buildSchema(`
    type Meal {
        _id: ID!
        description: String!
        calorie: Float!
        protein: Float!
        fat: Float!
        carb: Float!
    }

    type User {
        _id: ID!
        email: String!
        password: String
    }

    input MealInput {
        description: String!
        calorie: Float!
        protein: Float!
        fat: Float!
        carb: Float!
    }

    input UserInput {
        email: String!
        password: String!
    }

    type RootQuery {
        meals: [Meal!]!
    }

    type RootMutation {
        createMeal(input: MealInput): Meal
        createUser(input: UserInput): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`
);

const root = {
    meals: () => {
        return Meal
            .find()
            .then(meals => {
                return meals.map(meal => {
                    return { ...meal._doc }
                });
            })
            .catch(err => {
                throw err;
            });
    },
    createMeal: (args) => {
        const meal = new Meal({
            description: args.input.description,
            calorie: args.input.calorie,
            protein: args.input.protein,
            fat: args.input.fat,
            carb: args.input.carb
        });

        return meal
            .save()
            .then(result => {
                console.log(result);
                return { ...result._doc };
            })
            .catch(err => {
                console.log(err);
                throw err;
            });

        return meal;
    },
    createUser: (args) => {
        return User.findOne({email: args.input.email}).then(user => {
            if (user) {
                throw new Error('User exists already.');
            }
            return bcrypt.hash(args.input.password, 12);
        })
        .then(hashedPassword => {
            const user = new User({
                email: args.input.email,
                password: hashedPassword
            });
            return user.save();
        })
        .then(result => {
            return { ...result._doc, password: null };
        })
        .catch(err => {
            throw err;
        });

    }
};

// app.get('/start', (req, res, next) => {
//     res.send('It\'s working!');
// });
app.use('/graphql', graphqlHTTP({
    schema: mySchema,
    rootValue: root,
    graphiql: true,
}));


mongoose.connect(conConfig)
    .then(() => {
        app.listen(port, host, () => {
            console.log(`Server is running on port: ${port}, and hostname: ${host}`);
        });
    }).catch(err => {
        console.log(err)
    });


