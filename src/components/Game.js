import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, Button, StyleSheet } from 'react-native';

import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';

class Game extends React.Component {
    static propTypes = {
        randomNumberCount: PropTypes.number.isRequired,
        initialSeconds: PropTypes.number.isRequired,
        onPlayAgain: PropTypes.func.isRequired,
    };

    state = {
        selectedIds: [],
        remainingSeconds: this.props.initialSeconds,
    };

    randomNumbers = Array
        .from({ length: this.props.randomNumberCount })
        .map(() => 1 + Math.floor(10 * Math.random()));
    
    target = this.randomNumbers
        .slice(0, this.props.randomNumberCount - 2)
        .reduce((acc, curr) => acc + curr, 0);

    shuffledRandomNumbers = shuffle(this.randomNumbers);
    // shuffle random numbers

    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState((prevState) => {
                return { remainingSeconds: prevState.remainingSeconds - 1 };
            }, () => {
                if (this.state.remainingSeconds === 0) {
                    clearInterval(this.intervalId);
                }
            });
        }, 1000);
    };

    componentWillUnmount() {
        clearInterval(this.intervalId);
    };
    
    isNumberSelected = (numberIndex) => this.state.selectedIds.indexOf(numberIndex) !== -1;

    selectNumber = (numberIndex) => {
        this.setState((prevState) => ({
            selectedIds: [...prevState.selectedIds, numberIndex],
        }));
    };

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if (
            nextState.selectedIds !== this.state.selectedIds ||
            nextState.remainingSeconds === 0
        ) {
            this.gameStatus = this.calcGameStatus(nextState);

            // if game has already finished, clear the timer
            if (this.gameStatus !== 'PLAYING') {
                clearInterval(this.intervalId);
            }
        }
    };

    gameStatus = 'PLAYING';

    calcGameStatus = (nextState) => {
        if (nextState.remainingSeconds === 0 && this.gameStatus === 'PLAYING') {
            return 'LOST';
        }

        const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
            return acc + this.shuffledRandomNumbers[curr]
        }, 0);
        
        if (sumSelected < this.target) {
            return 'PLAYING';
        }
        
        if (sumSelected === this.target) {
            return 'WON';
        }

        return 'LOST';
    };

    targetPanelStyle = (gameStatus) => {

    };

    render() {
        const gameStatus = this.gameStatus;
        return (
          <View style={styles.container}>
            <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
              {this.target}
            </Text>

            <View style={styles.randomContainer}>
              {this.shuffledRandomNumbers.map((randomNumber, index) => (
                <RandomNumber
                  key={index}
                  id={index}
                  number={randomNumber}
                  isDisabled={
                    this.isNumberSelected(index) || gameStatus !== 'PLAYING'
                  }
                  onPress={this.selectNumber}
                />
              ))}
            </View>

            {this.gameStatus !== 'PLAYING' && (
              <Button
                color="blue"
                title="PLAY AGAIN"
                onPress={this.props.onPlayAgain}
              />
            )}

            <Text style={[styles.timer, styles.timerText]}>
              Time Remaining:
            </Text>
            <Text style={styles.timer}>{this.state.remainingSeconds}</Text>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
    paddingTop: 50,
    paddingBottom: 100,
  },

  target: {
    fontSize: 50,
    margin: 50,
    textAlign: 'center',
    color: 'white',
  },

  playAgain: {
    paddingBottom: 100,
  },

  timerText: {
    paddingTop: 50,
  },

  timer: {
    fontSize: 25,
    textAlign: 'center',
    color: 'red',
  },

  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  STATUS_PLAYING: {
    backgroundColor: 'blue',
  },

  STATUS_WON: {
    backgroundColor: 'green',
  },

  STATUS_LOST: {
    backgroundColor: 'red',
  },
});

export default Game;
