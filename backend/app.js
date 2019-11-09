const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
const port = 4000;
const host = 'localhost';

app.use(bodyParser.json());


const mySchema = buildSchema(`
    type RootQuery {
        meals: [String!]!
    }

    type RootMutation {
        createMeal(name: String): String
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`
);

const root = {
    meals: () => {
        return ['Breakfast', 'Dinner', 'Supper'];
    },
    createMeal: (args) => {
        const mealName = args.name;
        return mealName;
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
