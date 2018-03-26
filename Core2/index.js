//Import Frameworks
const express = require ('express');
const bodyParser = require('body-parser');
const path = require ('path');
const expressValidator = require ('express-validator');
const app = express();

//Middleware-> Loggin Example (Everytime when reload)
const logger = function(req,res,next){
  console.log('Logging.....');
  next();
};
app.use(logger);

//View Engine
app.set('view engine', 'ejs');
app.set('set',path.join(__dirname, 'views')); //Relative Path to the Folder

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/*Set Static path
app.use(express.static(path.join(__dirname, 'root')));
*/
//Global Variables
app.use(function(req,res,next){
  res.locals.errors = null
  next();
});
//Input Validation Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    const namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

    while (namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

/* Json Array Example
const people = [
  {
    name:'Lex',
    Age: 18
  },
  {
    name:'Yolo',
    Age: 18
  },
  {
    name:'Lol',
    Age: 19
  },
  {
    name:'ttt',
    Age: 20
  }
]
*/

/*Json Eaxmple
const person = {
  name: 'Alex',
  Age: 18
}
*/

//Current User List
const users =[
  {
    id:1,
    first_name: 'Jhon',
    last_name: 'Doe',
    email: 'jhondoe@gmail.com',
  },
  {
    id:2,
    first_name:'Alex',
    last_name:'Lo',
    email:'alexlo0612@hotmail.com.tw',
  },
  {
    id:3,
    first_name:'Dimitri',
    last_name:'Blitznieve',
    email:'Stalizanashyorni@gmail.com',
  }
]

//Web Page Content (What gets delieverd when people visit your site)
app.get('/', function(req,res){
  //res.send('Hello World');
  //res.json(person);
  //res.json(people);
  res.render('index', {
    title: 'Customer',
    users: users
  });
});

//When People Interact with Your site (the button)
app.post('/users/add',function(req, res){
  //console.log('Form Submitted');
  //console.log(req.body.first_name);

//Input Validation
  req.checkBody('first_name','First Name is Required!').notEmpty();
  req.checkBody('last_name','Last Name is Required!').notEmpty();
  req.checkBody('email','Email is Required!').notEmpty();

  const errors = req.validationErrors();
  if(errors){
    console.log('ERRORS');
    res.render('index', {
      title: 'Customer',
      users: users,
      errors: errors

    }); //Print errors if anything gone wrong
  }else {                 //Else create a new user
    const new_user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
    }
    console.log(new_user);
    console.log('SUCCESS');
  }
});

//Server Listening on Port 3000
app.listen(3000,function(){
    console.log('Server started on port 3000');
});
