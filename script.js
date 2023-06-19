var ball = document.querySelector('.ball');
var rod1 = document.getElementById('top');
var rod2 = document.getElementById('bottom');


const storeName = "PPName";
const storeScore = "PPMaxScore";
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";


let score;
let maxScore;
let movement;
let rod;
let winner;
let rod1X;
let rod2X;
let ballSpeedX = 2;
let ballSpeedY = 2;
let gameOn = false;

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;



(async function () {
    winner = localStorage.getItem(storeName);
    maxScore = localStorage.getItem(storeScore);

    if (rod == null || maxScore == null) {
        await Swal.fire({
            title: 'This is the first time you are playing this game.',
            width: 600,
            padding: '3em',
            color: '#716add',
            background: '#fff url(./images/trees.png)',
            confirmButtonText: 'Let\'s Start!',
            backdrop: `
              rgba(0,0,123,0.4)
              url("./images/nyan-cat.gif")
              left top
              no-repeat
            `
          });//This is the first time you are playing this game. LET'S START
        maxScore = 0;
        rod = "Rod1";
    } else {
        alert(winner + " has maximum score of " + maxScore * 100);
    }
    // alert("Press Enter to start the game!");
    await Swal.fire({
        title: 'Use keys \"A\" and \"D\" to move the rod in left or right direction respectively!',
        color: '#716add',
        icon: 'info'
    });//Use keys \"A\" and \"D\" to move the rod in left or right direction respectively!
    await Swal.fire({
        title: 'Advise: In case of any glitch, just click once or twice anywhere on your screen',
        color: '#716add',
        icon: 'warning'
    });//Advise: In case of any glitch, just click once or twice anywhere on your screen
    resetBoard(rod);
})();



function resetBoard(rodName) {

    rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + 'px';
    rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + 'px';
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';


    // Lossing player gets the ball
    if (rodName === rod2Name) {
        ball.style.top = (rod1.offsetTop + rod1.offsetHeight) + 'px';
        ballSpeedY = 2;
    } else if (rodName === rod1Name) {
        ball.style.top = (rod2.offsetTop - rod2.offsetHeight) + 'px';
        ballSpeedY = -2;
    }
    
    score = 0;
    gameOn = false;
    Swal.fire({
        title: 'Press Enter to start the game!',
        color: '#716add',
        icon: 'success'
    });//Press Enter to start the game!


}



function storeWin(rod,winner,score) {

    if (score > maxScore) {
        maxScore = score;
        // localStorage.setItem(storeName, rod);
        localStorage.setItem(storeName, winner);
        localStorage.setItem(storeScore, maxScore);
    }

    // alert(winner + " wins with a score of " + (score * 100) + ". Max score is: " + (maxScore * 100));
    // clearInterval(movement);
    resetBoard(rod);

    // alert(winner + " wins with a score of " + (score * 100) + ". Max score is: " + (maxScore * 100));

}



function toMove(e) {
    let rodSpeed = 20;

    let rodRect = rod1.getBoundingClientRect();


    if (e.key === 'd'&& ((rodRect.x + rodRect.width) < window.innerWidth)) {
        rod1.style.left = (rodRect.x) + rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    } else if (e.key === 'a' && (rodRect.x > 0)) {
        rod1.style.left = (rodRect.x) - rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    }


    if (e.key === 'Enter') {

        if (!gameOn) {
            gameOn = true;
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDia = ballRect.width;

            let rod1Height = rod1.offsetHeight;
            let rod2Height = rod2.offsetHeight;
            let rod1Width = rod1.offsetWidth;
            let rod2Width = rod2.offsetWidth;


            movement = setInterval(async function () {
                // Move ball 
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                rod1X = rod1.getBoundingClientRect().x;
                rod2X = rod2.getBoundingClientRect().x;

                ball.style.left = ballX + 'px';
                ball.style.top = ballY + 'px';


                if ((ballX + ballDia) > windowWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX; // Reverses the direction
                }

                // It specifies the center of the ball on the viewport
                let ballPos = ballX + ballDia / 2;

                // Check for Rod 1
                if (ballY <= rod1Height) {
                    ballSpeedY = -ballSpeedY; // Reverses the direction
                    score++;

                    // Check if the game ends
                    if ((ballPos < rod1X) || (ballPos > (rod1X + rod1Width))) {
                        clearInterval(movement);
                        if(score > maxScore){
                            const { value: winnerName } = await Swal.fire({
                                title: 'Congrats! You have surpassed the maximum score',
                                input: 'text',
                                inputLabel: 'Your name:',
                                inputPlaceholder: 'Enter your name',
                            });
                              
                            if (winnerName) {
                                await Swal.fire(`Entered name: ${winnerName}`);
                            }
                            await Swal.fire(`${winnerName} has maximum score of ${score*100}`);
                            winner = winnerName; //winner + " has maximum score of " + score * 100
                        }
                        else{
                            await Swal.fire(`You have reached a score of ${score * 100}. Max score is: ${maxScore * 100}`);
                            await Swal.fire(`${winner} has maximum score of ${maxScore * 100}`);
                        }
                        storeWin(rod1Name, winner, score);
                    }
                }

                // Check for Rod 2
                else if ((ballY + ballDia) >= (windowHeight - rod2Height)) {
                    ballSpeedY = -ballSpeedY; //Reverses the direction
                    score++;

                    //Check if the game ends
                    if ((ballPos < rod2X) || (ballPos > (rod2X + rod2Width))) {
                        clearInterval(movement);
                        if(score > maxScore){
                            const { value: winnerName } = await Swal.fire({
                                title: 'Congrats! You have surpassed the maximum score',
                                input: 'text',
                                inputLabel: 'Your name:',
                                inputPlaceholder: 'Enter your name',
                            });
                              
                            if (winnerName) {
                                await Swal.fire(`Entered name: ${winnerName}`);
                            }
                            await Swal.fire(`${winnerName} has maximum score of ${score*100}`);
                            winner = winnerName; //winner + " has maximum score of " + score * 100
                        }
                        else{
                            await Swal.fire(`You have reached a score of ${score * 100}. Max score is: ${maxScore * 100}`);
                            await Swal.fire(`${winner} has maximum score of ${maxScore * 100}`);
                        }
                        storeWin(rod2Name, winner, score);
                    }
                }

            }, 10);

        }
    }

};
{
    document.addEventListener('keypress',toMove);
}
