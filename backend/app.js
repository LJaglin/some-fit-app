const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Meal = require('./models/meal');

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

    input MealInput {
        description: String!
        calorie: Float!
        protein: Float!
        fat: Float!
        carb: Float!
    }

    type RootQuery {
        meals: [Meal!]!
    }

    type RootMutation {
        createMeal(input: MealInput): Meal
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`
);

const root = {
    meals: () => {
        return meals;
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


