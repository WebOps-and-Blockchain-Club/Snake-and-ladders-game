import Dice from "../Dice/Dice";
import { colorCode } from "../shared/data";
import "./GameSpace.css";

const GameSpace = (props) => {
  //   console.log(props.BoardCell);
  return (
    <>
      {!props.gameStarted ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
          className="text-primary"
        >
          <h4 className="my-5"> Waiting for other player to join the room</h4>
          <div className="loader"></div>
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          {props.gameStatus ? (
            <div>
              {props.win ? (
                <div>
                  <h4 style={{ color: "Green" }}>Alert: You Won</h4>
                </div>
              ) : (
                <div>
                  <h4 style={{ color: "Red" }}>Alert: You Lost</h4>
                </div>
              )}
            </div>
          ) : (
            <>
              <div>
                <Dice diceValue={props.diceValue} />
                {props.userActive ? (
                  <button
                    className="btn btn-info mx-2 my-3"
                    onClick={() => {
                      let dice = props.diceRoll();
                      props.setDiceValue(dice);
                      props.UpdateBoard(dice);
                    }}
                  >
                    Roll
                  </button>
                ) : (
                  <div className="mt-3">
                    <div
                      className="loader"
                      style={{ width: "20px", height: "20px" }}
                    ></div>
                  </div>
                )}
              </div>
              <div>
                {props.BoardCell.map((BoardRow, index) => {
                  return (
                    <div style={{ display: "flex" }} key={index}>
                      {BoardRow.map((Cell) => {
                        return (
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              border: "1px solid #ffc107",
                              borderRadius: "4px",
                              fontSize: "10px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              color: "#198754",
                              fontWeight: "700",
                            }}
                            key={Cell.id}
                          >
                            <div>
                              {Cell.id}
                              {Cell.move ? (
                                <span style={{ color: "#dc3545" }}>
                                  -&gt;{Cell.move}
                                </span>
                              ) : null}
                              {Cell.player.length !== 0 ? (
                                <div
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%",
                                    backgroundColor:
                                      colorCode[
                                        Cell.player[Cell.player.length - 1] - 1
                                      ],
                                  }}
                                ></div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default GameSpace;
