import { View, Dimensions, StyleSheet, Text } from "react-native";
import { LineChart, ProgressChart } from "react-native-chart-kit";
import GeneralStats from "./GeneralStats";
import { PlanAPI } from "@/serverAPI/PlanAPI";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import moment from "moment";
import { GeneralStatsI } from "./types";
import {formatDate} from "@/app/(tabs)/PersonalInfo";

interface PlanDateI {
  firstDate: string;
  lastDate: string;
  progressPercentage: number;
}

const chartConfig = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#1E90FF",
  backgroundGradientTo: "#80c0ff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#0a86ff",
  },
};

const MyStats = () => {
  const analyzeWorkoutData = (plan: any) => {
    const result: any = [];

    plan.forEach((week: any) => {
      week.days.forEach((day: any) => {
        if (
          day.difficultyFeedback !== undefined &&
          day.completedDistance !== undefined &&
          day.completedTime !== undefined
        ) {
          result.push({
            date: day.date,
            workout: day.workout,
            difficultyFeedback: day.difficultyFeedback,
            completedDistance: day.completedDistance,
            completedTime: day.completedTime,
          });
        }
      });
    });

    return result;
  };

  const getPlanDates = (plan: any) => {
    if (!plan || plan.length === 0) return null;

    // Extract the first and last dates from the plan
    const firstDate = plan[0].days[0].date as string;
    const lastDate = plan[plan.length - 1].days[
      plan[plan.length - 1].days.length - 1
    ].date as string;

    const today = moment();
    const startDate = moment(firstDate, "YYYY/MM/DD");
    const endDate = moment(lastDate, "YYYY/MM/DD");

    let progressPercentage;

    // If today's date is before the start date, progress is 0%
    if (today < startDate) {
      progressPercentage = 0;
    } else if (today > endDate) {
      progressPercentage = 100;
    } else {
      const totalDuration = endDate.diff(startDate, "days");
      const elapsedDuration = today.diff(startDate, "days");
      progressPercentage = elapsedDuration / totalDuration;
    }

    return {
      firstDate,
      lastDate,
      progressPercentage,
    };
  };

  function getGeneralStats(plan: any) {
    let totalCompletedDistance = 0;
    let totalCompletedTime = 0;
    let trainingsDone = 0;

    plan.forEach((week: any) => {
      week.days.forEach((day: any) => {
        if (day.completedDistance && day.completedTime) {
          totalCompletedDistance += day.completedDistance;
          totalCompletedTime += day.completedTime;
          trainingsDone++;
        }
      });
    });

    return {
      totalCompletedDistance,
      totalCompletedTime,
      trainingsDone,
    };
  }

  const [analyzedData, setAnalyzedData] = useState([]);
  const [planDates, setPlanDates] = useState<PlanDateI>();
  const [generalStats, setGeneralStats] = useState<GeneralStatsI>();

  useFocusEffect(
    useCallback(() => {
      PlanAPI.getPlan().then((res) => {
        const analyzedData = analyzeWorkoutData(res.data.plan);
        const planDates = getPlanDates(res.data.plan);
        const generalStats = getGeneralStats(res.data.plan);
        generalStats && setGeneralStats(generalStats);
        planDates && setPlanDates(planDates);
        setAnalyzedData(analyzedData);
      });
    }, [])
  );

  return (
    analyzedData?.length > 0 && (
      <View style={styles.container}>
        <ProgressChart
          data={{
            labels: planDates ? [`${formatDate(planDates.firstDate)} - ${formatDate(planDates.lastDate)}`] : undefined,
            data: [planDates?.progressPercentage || 0],
          }}
          width={Dimensions.get("window").width}
          height={100}
          strokeWidth={10}
          radius={32}
          chartConfig={chartConfig}
          hideLegend={false}
        />
        <LineChart
          data={{
            labels: analyzedData?.map((el: any) => {return el ? formatDate(el.date) : ""}),
            datasets: [
              {
                data: analyzedData?.map((el: any) => el?.difficultyFeedback),
              },
            ],
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
        <GeneralStats
          totalCompletedDistance={generalStats?.totalCompletedDistance}
          totalCompletedTime={generalStats?.totalCompletedTime}
          trainingsDone={generalStats?.trainingsDone}
        />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default MyStats;
