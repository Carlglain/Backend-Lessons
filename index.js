import express from 'express';
import morgan from 'morgan';
import logger from './logger.js';
const app = express();
const port =2010;
const morganFormat = ":method :url :status :response-time ms";

app.use(express.json())

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
app.get('/', (req, res) => {
    res.send("Welcome to my orginized backend course!");
})

let teaDAta = [];
let teaId =0;
app.post('/tea', (req, res) => {
    const {name, price} = req.body;
    const newTea = {teaId: teaId++,name,price};
    teaDAta.push(newTea);
    res.status(201).send(newTea)
})
//get all tea
app.get('/displayTea',(req,res)=>{
    res.status(200).send(teaDAta)
})
//get tea by id
app.get('/tea/:id', (req,res)=>{
    const tea = teaDAta.find(t=>t.teaId === parseInt(req.params.id))
    if(!tea){
        res.status(404).send("Tea with id " + req.params.id + " not found");
        
    }
    res.status(200).send(tea)
})
//update tea
app.put('/tea/:id', (req,res)=>{
    const tea = teaDAta.find(t=>t.teaId === parseInt(req.params.id))
    if(!tea){
        return res.status(404).send("Tea with id " + req.params.id + " not found");
        
    }
    const {name,price} =req.body;
   tea.name = name;
   tea.price = price;
    return res.status(200).send(teaDAta)
})
//delete tea
app.delete('/tea/:id', (req,res)=>{
     const index =teaDAta.findIndex(tea => tea.teaId === parseInt(req.params.id))
     if(index === -1){
       return res.status(404).send("tea with id " +req.params.id + " not found");
     }
     teaDAta.splice(index, 1);
     return res.status(200).send("tea deleted");
})
app.listen(port, ()=> {
    console.log(`Server listening on port  ${port}`);
})
