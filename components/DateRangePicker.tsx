import React, { FC, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar } from 'react-native-calendars';
import {format, eachDayOfInterval, parseISO, isBefore} from 'date-fns';
import Theme from "@/appTheme";

interface DateRangePickerProps {
    label?: string;
    dispatchDates: (startDate: string, endDate: string) => void;
}

const DateRangePicker: FC<DateRangePickerProps> = ({ label, dispatchDates }) => {
    const [selectedRange, setSelectedRange] = useState<{ start: string | undefined, end: string | undefined }>({
        start: undefined,
        end: undefined
    });

    function convertCalendarDateToModernFormat(calendarDate:string) {
        const desiredTime = "21:00:00.000+00:00";
        // Extract the date part (before 'T')
        const datePart = calendarDate.split('T')[0]; // "2024-08-23"

        // Combine the date part with the desired time
        const formattedDate = `${datePart}T${desiredTime}`;

        console.log(formattedDate); // "dateT21:00:00.000+00:00"

        return formattedDate;
    }

    const handleDispatchDates =  (startDate: string, endDate: string) => {
        const formattedStartDate = convertCalendarDateToModernFormat(startDate);
        const formattedEndDate = convertCalendarDateToModernFormat(endDate);

        dispatchDates(formattedStartDate, formattedEndDate);
    }

// Usage example
    const calendarDate = "2024-08-23T00:00:00.000+00:00";

    const formattedDate = convertCalendarDateToModernFormat(calendarDate);


    const handleDayPress = (day: any) => {
        const { dateString } = day;
        if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
            // Select start date
            setSelectedRange({ start: dateString, end: undefined });
        } else if(selectedRange.start && ! selectedRange.end) {
            // Select end date
            const startDate = parseISO(selectedRange.start);
            const endDate = parseISO(dateString);

            if (isBefore(endDate, startDate)) {
                // If end date is before start date, swap the dates
                setSelectedRange({ start: dateString, end: selectedRange.start });
                handleDispatchDates(dateString, selectedRange.start);
            } else {
                // Valid end date
                setSelectedRange({ ...selectedRange, end: dateString });
                handleDispatchDates(selectedRange.start, dateString);
            }
        } else  {
            setSelectedRange({ start: undefined, end: undefined });
        }
    };

    const generateMarkedDates = () => {
        if (!selectedRange.start || !selectedRange.end) return {};

        const startDate = parseISO(selectedRange.start);
        const endDate = parseISO(selectedRange.end);
        const rangeDates = eachDayOfInterval({ start: startDate, end: endDate });

        const markedDates: Record<string, any> = {};
        rangeDates.forEach(date => {
            const dateString = format(date, 'yyyy-MM-dd');
            markedDates[dateString] = { color: Theme.colors.themeColor, textColor: 'white' };
        });

        return {
            ...markedDates,
            [selectedRange.start]: { startingDay: true, color: Theme.colors.themeColor, textColor: 'white' },
            [selectedRange.end]: { endingDay: true, color: Theme.colors.themeColor, textColor: 'white' }
        };
    };

    return (
        <View style={styles.container}>
            {label && <Text style={{ fontSize: 25, fontWeight: '600', marginVertical: 10 }}>
                {label}
            </Text>}
            <Calendar
                onDayPress={handleDayPress}
                markingType='period'
                markedDates={selectedRange.start && !selectedRange.end ?
                    { [selectedRange.start]: { startingDay: true, color: Theme.colors.themeColor, textColor: 'white' } }
                    :generateMarkedDates()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 300,
    },
});

export default DateRangePicker;
