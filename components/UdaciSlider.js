import React from 'react'
import { Slider, View, Text } from 'react-native'

function UdaciSlider({ max, unit, step, value, onChange }) {
    return (
        <View>
            <Slider
                step={step}
                value={value}
                maximumValue={max}
                minimumValue={0}
                onValueChange={onChange}
            />
            <View>
                <Text>{value}</Text>
                <Text>{unit}</Text>
            </View>
        </View>
    )
}

export default UdaciSlider;
