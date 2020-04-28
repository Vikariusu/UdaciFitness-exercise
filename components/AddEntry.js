import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import { Ionicons } from '@expo/vector-icons'
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import { white, purple } from '../utils/colors'

import { connect } from 'react-redux'
import { addEntry } from '../actions'

function SubmitBtn({ onPress }) {
    return (
        <TouchableOpacity
            style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
            onPress={onPress}
        >
            <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity >
    )
}

class AddEntry extends Component {
    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0
    }

    // Increment UdaciSteppers
    increment = (metric) => {
        const { max, step } = getMetricMetaInfo(metric)

        this.setState((state) => {
            const count = state[metric] + step;

            return {
                ...state,
                [metric]: count > max ? max : count
            }
        })
    }

    // Decrement UdaciSteppers
    decrement = (metric) => {
        this.setState((state) => {
            const count = state[metric] - getMetricMetaInfo(metric).step;

            return {
                ...state,
                [metric]: count < 0 ? 0 : count
            }
        })
    }

    // Increment and decrement UdaciSlider
    slide = (metric, value) => {
        this.setState(() => ({
            [metric]: value
        }))
    }

    submit = () => {
        const time = timeToString(); // this will be the key
        const entry = this.state

        // Update Redux
        this.props.dispatch(addEntry({
            [time]: entry
        }))

        this.setState(() => ({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0
        }))

        // Navigate to home

        // Save to 'DB' - AsyncStorage
        submitEntry({ time, entry })

        // Clean local notification

    }

    // reset used by the TextButton to clear the entry for the day
    reset = () => {
        const time = timeToString();

        // Update Redux
        // will display "Don't forget to log your data today!"
        this.props.dispatch(addEntry({
            [time]: getDailyReminderValue()
        }))

        // Route to Home

        // Update "DB" - AsyncStorage
        removeEntry(time)

    }

    render() {
        const metaInfo = getMetricMetaInfo()

        // Display smiley face if the user already submitted data for the day
        if (this.props.alreadyLogged) {
            return (
                <View style={styles.center}>
                    <Ionicons
                        name={Platform.OS === 'ios' ? 'ios-happy' : 'md-happy'}
                        size={100}
                    />
                    <Text>You already logged your information for today</Text>
                    <TextButton style={{ padding: 10 }} onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <DateHeader date={(new Date()).toLocaleDateString()} />
                {
                    Object.keys(metaInfo).map((metric) => {
                        const { getIcon, type, ...rest } = metaInfo[metric];
                        const value = this.state[metric]

                        return (
                            <View key={metric} style={styles.row}>
                                {getIcon()}
                                {type === 'slider'
                                    ? <UdaciSlider
                                        value={value}
                                        onChange={(value) => this.slide(metric, value)}
                                        {...rest}
                                    />
                                    : <UdaciSteppers
                                        value={value}
                                        onIncrement={() => this.increment(metric)}
                                        onDecrement={() => this.decrement(metric)}
                                        {...rest}
                                    />
                                }
                            </View>
                        )
                    })
                }

                <SubmitBtn onPress={this.submit} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: white
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    iosSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40
    },
    androidSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        height: 45,
        borderRadius: 2,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30
    }
})

function mapStateToProps(state) {
    const time = timeToString()

    return {
        alreadyLogged: state[time] && typeof state[time].today === 'undefined'
    }
}

export default connect(mapStateToProps)(AddEntry)