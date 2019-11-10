const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
const port = 4000;
const host = 'localhost';

//temporary
const meals = [];

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
        const meal = {
            _id: Math.random().toString(),
            description: args.input.description,
            calorie: args.input.calorie,
            protein: args.input.protein,
            fat: args.input.fat,
            carb: args.input.carb
        };

        console.log(meal);

        meals.push(meal);
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

app.listen(port, host, () => {
    console.log(`Server is running on port: ${port}, and hostname: ${host}`);
});
