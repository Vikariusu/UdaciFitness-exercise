import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { getMetricMetaInfo, timeToString } from '../utils/helpers'
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'

function SubmitBtn({ onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <Text>Submit</Text>
        </TouchableOpacity >
    )
}

export default class AddEntry extends Component {
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

        this.setState(() => {
            const count = state[metric] + step;

            return {
                ...state,
                [metric]: count > max ? max : count
            }
        })
    }

    // Decrement UdaciSteppers
    decrement = (metric) => {
        this.setState(() => {
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

        this.setState(() => ({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0
        }))

        // Navigate to home

        // Save to 'DB'

        // Clean local notification

    }

    render() {
        const metaInfo = getMetricMetaInfo()
        return (
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()} />
                <Text>{JSON.stringify(this.state)}</Text>

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
                                        onChange={(value) => this.slide(key, value)}
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
