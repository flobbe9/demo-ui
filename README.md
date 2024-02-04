# word_light_frontend
Frontend for Word light api. Uses react.js 18 with typescript.

# Run
### Locally
```docker-compose -f docker-compose.local.yml up``` <br>
Call this inside project root folder of repository inside dev or stage branch. <br>

### Dockerhub
```docker-compose up``` <br>
Call this with .env file in same folder as docker-compose.yml. <br>

### The whole thing
```docker-compose -f docker-compose.all.yml up``` <br>
This file can be found at https://github.com/flobbe9/word_light_document_builder <br>
Call this with .env file in same folder as docker-compose.yml. <br>
Will start the whole microservice including backend etc.. No further configuration needed.

# More documentation
Run document_builder api (https://github.com/flobbe9/word_light_document_builder), then visit http://localhost:4001