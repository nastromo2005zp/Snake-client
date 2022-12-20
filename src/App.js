import React, {useState, useEffect} from "react";
import './App.css';
import Cell from "./Components/cell";


/* Game settings */
const HOST = 'https://snake-server-app.herokuapp.com/';
/* size of game board */
const BOARD_SIZE = 12;

/* filling gameboard */
const DEFAULT_CELLS_VALUE = Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill(0));

/* Available moves of the snake */
const AVAILABLE_MOVES = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 's', 'p'];



/* user info */
let userData = {
    "id":0,
    "name": "Unknown Player",
    "score": 0
};
let user = prompt('Enter your name');
if (!user) {user = userData.name};



/* moving snake in the borders of gameboard */
const checkAvailableSlot = position => {
    switch (true) {
        case position >= BOARD_SIZE:
            return 0;
        case position < 0:
            return BOARD_SIZE - 1;
        default:
            return position;
    }
}
/* do not arrow scroll */
document.body.onkeydown = function(e){
    e = e || window.event;
    const c = e.keyCode;
     if(c>32 && c<41) return false;


}





const App = () => {


  /* The Snake */
  const [snake, setSnake] = useState([[1, 1]]);
  /* The Food */
  const [food, setFood] = useState([0, 0]);
    /* The speed */
  const [speed, setSpeed] = useState(350);

  const [direction, setDirection] = useState(AVAILABLE_MOVES[5]);

  const [reminder, setReminder] = useState('');

  const [table, setTable] = useState([{
      "id":0,
      "name": "Unknown Player",
      "score": 0
  }]);
  // const [currentSnakeLength, setCurrentSnakeLength] = useState(0);

    useEffect(() => {
        fetch (`${HOST}/api/user`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setTable(data);
            })

    }, []);













  /* keystroke tracking */
    const handleKeyDown = (event) => {
        //console.log(event.key);
        const index = AVAILABLE_MOVES.indexOf(event.key);
        //console.log(event.key);
        if (index > -1) {
            setDirection(AVAILABLE_MOVES[index]);
        }
    }
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
    })
    function gameOver () {
               alert(`Game over! Ok, ${user} your score is ${snake.length - 1}`);
                    userData.name = user;
                    userData.score = snake.length - 1;
                         fetch (`${HOST}/api/user`, {
                            method: 'POST',
                            mode: 'cors',
                            cache: 'no-cache',
                            credentials: 'same-origin',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            redirect: 'follow',
                            referrerPolicy: 'no-referrer',
                            body: JSON.stringify(userData)
                        });
    }
/* game process */
    useEffect(() => {

        const interval = direction !== AVAILABLE_MOVES[4] ? gameLoop() : gameOver();//alert("Game over");
        return () => clearInterval(interval);



    }, [])//snake


   /* generate random food position */
   const generateFood = () => {
       let newFood


       if (snake.some(elem => elem[0] === newFood[0] && elem[1] === newFood[1])){
       setFood(newFood) 
        newFood = [
               Math.floor(Math.random() * BOARD_SIZE),
               Math.floor(Math.random() * BOARD_SIZE)
           ];
       }
           
      
        
    }

  const gameLoop = () => {
        const timerId = setTimeout(() => {
           
            const newSnake = snake;
            let move = [];

            switch (direction) {
                 case AVAILABLE_MOVES[0]:
                    move = [1, 0];
                    break;
                 case AVAILABLE_MOVES[1]:
                    move = [-1, 0];
                    break;
                case AVAILABLE_MOVES[2]:
                    move = [0, 1];
                    break;
                case AVAILABLE_MOVES[3]:
                    move = [0, -1];
                    break;
                case AVAILABLE_MOVES[4]:

                    break;
                case AVAILABLE_MOVES[5]:
                    move = [0, 0];

                    break;
                default:
                    move = [1, 0];

            }



            /* moving head */
            const head = [
                checkAvailableSlot(newSnake[newSnake.length-1][0] + move[0]),
                checkAvailableSlot(newSnake[newSnake.length-1][1] + move[1])
            ]

            /* crossing body */


                if(snake.length > 1 && direction !== AVAILABLE_MOVES[5]) {



                    if(snake.some(elem => elem[0] === head[0] && elem[1] === head[1])) {


                    setDirection(AVAILABLE_MOVES[4]);




                    }
                }





            newSnake.push(head);
            let spliceIndex = 1;
            /* eating food and increasing size of the snake*/
            if (head[0] === food[0] && head[1] === food[1]) {
                spliceIndex = 0;

                /* reminder First 1 point, Second 5 point, Third 10 point, and icrease speed every 50 points */
                switch (true) {
                        case snake.length-1 === 1:
                        setReminder('Wow First Point!');
                        break;

                        case snake.length-1 === 5:
                        setReminder('Yeah Five Point!');
                        break;

                        case snake.length-1 === 10:
                        setReminder('Cool It`s Ten Point!');
                        break;

                        default: setReminder('');

                }

                switch (true) {
                    case snake.length % 50 === 0 : setSpeed(speed - 50);
                    break;
                    default: console.log('default');

                }
                generateFood();
            }

            setSnake(newSnake.slice(spliceIndex));



        }, speed)
      return timerId;

  }


  return (
    <div className="App">
        <div className="header">
            <h1>The Snake</h1>
            <div className="game">
                <div className="main">
                    <div className="gameboard">

                        {DEFAULT_CELLS_VALUE.map((row, indexR) =>
                            <div key={indexR} className='row'>
                              {row.map((cell, indexC) => {
                                  let type = snake.some(elem => elem[0] === indexR && elem[1] === indexC) && 'snake';
                                  if (type !== 'snake') {
                                      type = (food[0] === indexR && food[1] === indexC) && 'food';
                                  }

                                return (
                                    <Cell key = {indexC} type = {type} />
                                )
                              })}
                            </div>

                        )}

                    </div>
                    <div className="aside">
                        <h6>Player Name: {user}</h6>
                        {/*<h2>Speed: {speed}</h2>*/}
                        <h6>Current score: {snake.length - 1}</h6>
                        <div className="alerts">

                            <p>
                                {reminder}
                            </p>

                        </div>



                        {/*{direction}*/}

                    </div>
                </div>
            </div>
            <div className="table">
                <div className="tableHeader">Hall of fame</div>
                <div className="parentTable">
                    <div>
                        Player Name
                    </div>
                    <div>
                        Score
                    </div>

                </div>
                {table.map((tableArr) =>  <div className="parentTable tableText" key={tableArr.id}>
                    <div>
                        {tableArr.name}
                    </div>
                    <div>
                        {tableArr.score}
                    </div>
                </div>)}





            </div>
        </div>
    </div>
  );
}



export default App;
