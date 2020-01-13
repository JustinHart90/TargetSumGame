import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleSheet } from 'react-native';

import RandomNumber from './RandomNumber';

class Game extends React.Component {
    static propTypes = {
        randomNumberCount: PropTypes.number.isRequired,
    };

    state = {
        selectedNumbers: [],
    };

    randomNumbers = Array
        .from({ length: this.props.randomNumberCount })
        .map(() => 1 + Math.floor(10 * Math.random()));
    
    target = this.randomNumbers
        .slice(0, this.props.randomNumberCount - 2)
        .reduce((acc, curr) => acc + curr, 0);

    // shuffle random numbers
    
    isNumberSelected = (numberIndex) => this.state.selectedNumbers.indexOf(numberIndex) !== -1;

    selectNumber = (numberIndex) => {
        this.setState((prevState) => ({
            selectedNumbers: [...prevState.selectedNumbers, numberIndex],
        }));
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.target}>{this.target}</Text>

                <View style={styles.randomContainer}>
                    {this.randomNumbers.map((randomNumber, index) => 
                        <RandomNumber 
                            key={index}
                            id={index}
                            number={randomNumber}
                            isDisabled={this.isNumberSelected(index)}
                            onPress={this.selectNumber}
                        />
                    )}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ddd',
        flex: 1,
        paddingTop: 50,
    },
    
    target: {
        fontSize: 50,
        backgroundColor: 'blue',
        color: 'white',
        margin: 50,
        textAlign: 'center',
    },

    randomContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
});

export default Game;
