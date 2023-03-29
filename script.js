const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const pug = require('pug');


const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json())



app.post('/definition', (req, res) => {

    let word = req.body.wordSearch
        fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word)
            .then( (response) =>  {
                //return data from dictionary API
                return response.json();
            })
            .then( (data) => {
                
                let [                   //set variables for use in the pug template

                    word,
                    wordPhonetic,
                    wordDefinition1,
                    wordDefinition2,
                    example1,
                    example2,

                ] = [
                    
                    data[0].word, 
                    data[0].phonetic, 
                    data[0].meanings[0].definitions[0].definition,
                    data[0].meanings[0].definitions[1].definition,
                    data[0].meanings[0].definitions[0].example,
                    data[0].meanings[0].definitions[1].example,
                ]

                res.render('definition.pug', { //renders new html template with word definition, phonetic pronounciation, and the word itself
                    word: word,
                    wordPhonetic: wordPhonetic,
                    wordDefinition1: wordDefinition1,
                    wordDefinition2: wordDefinition2,
                    example1: example1,
                    example2: example2,

                });
                
            })
            .catch( () => {
                //default value if word does not exist
                res.sendStatus(404)
            })
    }   
)


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, public, 'index.html'));
});


app.listen(3000);


