import "bootstrap/dist/css/bootstrap.min.css";

//Importing hooks
import { useState, useEffect } from "react";

//Importing components
import Room from "./Room/Room";
import GameSpace from "./GameSpace/GameSpace";
import { BoardCell, ExtraMove, LadderAndSnakes, NonExtraMove } from "./shared/data";

//Importing sockets using socket.io
const { io } = require("socket.io-client");
const socket = io("http://localhost:9000/");

function App() {
  const [roomId, setRoomId] = useState("");
  const [a, setA] = useState("a");
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [diceValue, setDiceValue] = useState(0);

  const [playerNumber, setPlayerNumber] = useState("");
  const [userActive, setUserActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [boardCell, setBoardCell] = useState(BoardCell);
  const [userValue, setUserValue] = useState(1);

  const diceRoll = () => Math.floor(Math.random() * 6) + 1;

  const UpdateBoard = (diceValue) => {
    const newBoard = [...boardCell];

    let finalScore = userValue + diceValue;

    let finalMove = LadderAndSnakes.find((key) => key.cell === finalScore);

    // console.log(finalMove);
    if (finalMove) {
      finalScore = finalMove.move;
    }

    // console.log(finalScore);

    if (userActive) {
      let score = userValue;

      if (score % 10 === 0) {
        score--;
      }

      let position = newBoard.length - (Math.floor(score / 10)) - 1;

      // console.log(newBoard[position]);

      newBoard[position].find((cell) => cell.id === userValue).player =
      newBoard[position].find((cell) => cell.id === userValue).player.filter(
        (num) => num !== playerNumber
      );

      setUserValue(finalScore);

      let Score = finalScore;

      if (Score % 10 === 0) {
        Score--;
      }

      let Position = newBoard.length - (Math.floor(Score / 10)) - 1;

      // console.log(newBoard[position]);

      newBoard[Position].find((cell) => cell.id === finalScore).player.push(playerNumber);
      

      setBoardCell(newBoard);
      if (NonExtraMove.includes(diceValue)){
        setUserActive(false);
      }

      if (ExtraMove.includes(diceValue)){
        setUserActive(true);
      }

      if (socket) {
        socket.emit("update_game", {
          newBoard,
          diceroll : diceValue,
        });
      }
    }


  };

  const handleGameUpdate = () => {
    if (socket) {
      socket.on("on_game_update", (data) => {
        setBoardCell(data.newBoard);

      if (ExtraMove.includes(data.diceroll)){
        setUserActive(false);
      }

      if (NonExtraMove.includes(data.diceroll)){
        setUserActive(true);
      }

      })
    }
  };

  const connect = () => {
    socket.on("connect", () => {
      console.log("we are connected to the server!!");
    });
  };

  const handleGameStart = () => {
    if (socket) {
      socket.on("start_game", (data) => {
        console.log(data);
        setPlayerNumber(data.player_number);
        setGameStarted(true);
        setUserActive(data.start);
      });
    }
  };

  useEffect(() => {
    connect();
    handleGameStart();
    handleGameUpdate();
  }, []);

  return (
    <>
      {joinedRoom ? (
        <GameSpace
          BoardCell={boardCell}
          diceValue={diceValue}
          setDiceValue={setDiceValue}
          diceRoll={diceRoll}
          playerNumber={playerNumber}
          gameStarted={gameStarted}
          userActive={userActive}
          UpdateBoard={UpdateBoard}

        />
      ) : (
        <Room
          roomId={roomId}
          setJoinedRoom={setJoinedRoom}
          setRoomId={setRoomId}
          socket={socket}
        />
      )}
    </>
  );
}

export default App;
