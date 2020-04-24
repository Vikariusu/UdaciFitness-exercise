import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import { Ionicons } from '@expo/vector-icons'
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'

import { connect } from 'react-redux'
import { addEntry } from '../actions'

function SubmitBtn({ onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <Text>Submit</Text>
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

        if (this.props.alreadyLogged) {
            return (
                <View>
                    <Ionicons
                        name={'ios-happy'}
                        size={100}
                    />
                    <Text>You already logged your information for today</Text>
                    <TextButton onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            )
        }

        return (
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()} />
                {
                    Object.keys(metaInfo).map((metric) => {
                        const { getIcon, type, ...rest } = metaInfo[metric];
                        const value = this.state[metric]

                        return (
                            <View key={metric}>
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

function mapStateToProps(state) {
    const time = timeToString()

    return {
        alreadyLogged: state[time] && typeof state[time].today === 'undefined'
    }
}

export default connect(mapStateToProps)(AddEntry)